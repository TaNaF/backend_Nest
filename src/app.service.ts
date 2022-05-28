import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async allSubject(): Promise<any> {
    const subject = await this.connection.query(`SELECT * FROM subject`)
    return subject;
  }

  async findClassService(subject_id:string,user:any):Promise<any>{
    const cl = await this.connection.query(`SELECT * FROM class WHERE subject_id = '${subject_id}'`);
    return cl;
  }

  async CheckTerm(){
    const res = await this.connection.query(`SELECT * FROM semester WHERE semester_date_start < CURRENT_DATE() AND semester_date_end > CURRENT_DATE()`)
    return res;  
  }

  async findClassJoinTeacher(subject_id:string):Promise<any>{
    const res = await this.connection.query(`SELECT class.class_id,class.subject_id,subject.subject_name,subject.credit,teacher.teacher_id,teacher.teacher_fname,teacher.teacher_lname,class.subject_section FROM class JOIN teacher ON class.teacher_id = teacher.teacher_id JOIN subject ON class.subject_id = subject.subject_id WHERE class.subject_id = '${subject_id}'`)
    return res;
  }
  async saveStudentClass(StudentClass:any[],student_id:string,semester_id:number):Promise<any>{
    try{
      StudentClass.forEach((value,index)=>{
        this.connection.query(`INSERT INTO studentclass(student_id,class_id,semester_id) VALUES ('${student_id}',${value},${semester_id})`)
      })
      return true;
    }catch(e){
      return false;
    }
  }
  async youRegisted(student_id:string,semester_id:number){
    const ss = await this.connection.query(`SELECT * FROM studentclass WHERE student_id = "${student_id}" AND semester_id = ${semester_id} LIMIT 1`);
    return ss;
  }


}
