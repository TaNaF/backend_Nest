import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class App2Service {
    constructor(@InjectConnection() private readonly connection: Connection){}
    //หาวิชาที่ลงไปแล้ว
    async getMySubject(student_id:string,semester_id:number){
        const result = (await this.connection.query(
        `SELECT class.class_id, subject.subject_id,subject.subject_name,subject.credit,class.subject_section,teacher.teacher_id,teacher.teacher_fname,teacher.teacher_lname
        FROM studentclass
        LEFT JOIN class on class.class_id = studentclass.class_id
        LEFT JOIN subject on subject.subject_id = class.subject_id
        LEFT JOIN teacher on teacher.teacher_id = class.teacher_id
        WHERE student_id = "${student_id}"
        AND semester_id = ${semester_id}`));
        return result;
    }
    //หาตอนเรียนของวิชาที่ใส่มา
    async getSectionSubject(subject_id:string){
        const result = await this.connection.query(`SELECT DISTINCT subject_section
        FROM class WHERE subject_id = '${subject_id}'`)
        console.log(result);
        return result;
    }

    //save 1 studentclass 
    async saveStudentClass(student_id,subject_id,sectionSelect,semester_id){
        const se = await this.connection.query(`SELECT * FROM class WHERE subject_id = '${subject_id}' AND subject_section = '${sectionSelect}'`);
        await this.connection.query(`INSERT INTO studentclass(student_id,class_id,semester_id) VALUES ('${student_id}',${se[0].class_id},${semester_id})`)
        return {success:true}
    }
    async changesection(student_id:string,subject_id:number,subject_section_old:number,subject_section_new:number){
        const sew = await this.connection.query(`SELECT * FROM class WHERE subject_id = "${subject_id}" AND (subject_section = '${subject_section_old}' OR subject_section = '${subject_section_new}')`);
        const old = sew.filter((value)=>value.subject_section === subject_section_old)[0].class_id;
        const newe = sew.filter((value)=>value.subject_section === subject_section_new)[0].class_id;
        console.log(old,newe)
        await this.connection.query(`UPDATE studentclass SET class_id = '${newe}' WHERE studentclass.student_id = '${student_id}' AND studentclass.class_id = '${old}'`);
    }

    async deleteSubject(student_id:string,class_id:number){
        await this.connection.query(`DELETE FROM studentclass WHERE student_id = ${student_id} AND class_id = ${class_id}`);
    }

    async getSemester(){
        const res = await this.connection.query("SELECT DISTINCT semester.semester_id,semester.semester_year,semester.semester_numer AS semester_number FROM studentclass INNER JOIN semester ON semester.semester_id = studentclass.semester_id ORDER BY semester.semester_year,semester.semester_numer DESC");
        return res;
    }
    async getMySemester(student_id:string,semester_id:number){
        const res = await  this.connection.query(
        `SELECT class.subject_id,subject.subject_name,subject.credit FROM studentclass
        INNER JOIN class ON class.class_id = studentclass.class_id
        INNER JOIN subject ON class.subject_id = subject.subject_id
        WHERE studentclass.student_id = "${student_id}"
        AND studentclass.semester_id = ${semester_id}`)
        console.log(res)
        return res;
    }
}
