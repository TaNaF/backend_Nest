import { Controller, Get, Request, Post, UseGuards, Param, Body, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { App2Service } from './app2/app2.service';
@Controller()
export class AppController {
  constructor(private authService: AuthService,private appService:AppService,private app2Service:App2Service) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(JwtAuthGuard)
  @Get('subjectall')
  getSubject(@Request() req) {
    return this.appService.allSubject();
  }
  @UseGuards(JwtAuthGuard)
  @Get('findclass/:subject_id')
  findClass(@Request() req,@Param('subject_id') subject_id) {
    return this.appService.findClassService(subject_id,req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findClassAndTeacher/:subject_id')
  findClassNTeacher(@Request() req,@Param('subject_id') subject_id) {
    return this.appService.findClassJoinTeacher(subject_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saveStudentClass')
  saveStudentClass(@Request() req,@Body() StudentClass:any) {
    return (this.appService.saveStudentClass(StudentClass.studentClass,req.user.student_id,StudentClass.semester_id))?{error:false,finish:true}:{error:true,finish:false};
  }

  //ขอดูว่าเทอมนี้และปีการศึกษาอะไร
  @UseGuards(JwtAuthGuard)
  @Get('getStudentTerm')
  async getStudentTerm(@Request() req){
    return (await this.appService.CheckTerm());
  }

  @UseGuards(JwtAuthGuard)
  @Get('youRegisted/:semester_id')
  async checkRegistered(@Request() req,@Param('semester_id') semester_id:number){
    const A = await this.appService.youRegisted(req.user.student_id,semester_id)
    console.log(A)
    return A;
  }
  //เอาวิชาที่ลงไปแล้วมาแสดงให้ดู
  @UseGuards(JwtAuthGuard)
  @Get('getSubject/:semester_id')
  async getMySubject(@Request() req,@Param('semester_id') semester_id){
    return await this.app2Service.getMySubject(req.user.student_id,semester_id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('findSection')
  async findSection(@Request() req,@Body() body){
    return (await this.app2Service.getSectionSubject(body.subject_id));
  }

  @UseGuards(JwtAuthGuard)
  @Post('saveonestudentclass')
  async saveonestudentclass(@Request() req,@Body() body){
    this.app2Service.saveStudentClass(req.user.student_id,body.subject_id,body.sectionSelect,body.semester_id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changSection')
  async changSection(@Request() req,@Body() body){
    this.app2Service.changesection(req.user.student_id,body.subject_id,body.old_section,body.new_section)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteSubject/:class_id')
  async deleteSubject(@Request() req,@Param('class_id') class_id){
    this.app2Service.deleteSubject(req.user.student_id,class_id)
  }
  //old 
  @UseGuards(JwtAuthGuard)
  @Get('getSemester')
  async getSemester(){
    return await this.app2Service.getSemester();
  }

  @UseGuards(JwtAuthGuard)
  @Post('getMySemester')
  async getmySemester(@Request() req,@Body() body){
    console.log(req.user.student_id,body.semester_id);
    return await this.app2Service.getMySubject(req.user.student_id,body.semester_id);
  }
}