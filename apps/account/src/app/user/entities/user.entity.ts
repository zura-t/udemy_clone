import { AccountChangedCourse } from "@udemy-clone/contracts";
import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@udemy-clone/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.displayName = user.displayName;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const existingCourse = this.courses.find(course => course.courseId === courseId);
    if (!existingCourse) {
      this.courses.push({
        courseId,
        purchaseState: state
      })
      return this;
    }
    if (state === PurchaseState.Canceled) {
      this.courses = this.courses.filter(course => course.courseId !== courseId);
      return this;
    }
    this.courses = this.courses.map(course => {
      if (course.courseId === courseId) {
        course.purchaseState = state;
        return course;
      }
      return course;
    })
    this.events.push({
      topic: AccountChangedCourse.topic, 
      data: {courseId, userId: this._id, state}
    });
    return this;
  }

  public getCourseState(courseId: string): PurchaseState {
    return this.courses.find(course => course.courseId === courseId)?.purchaseState ?? PurchaseState.Started;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName
    }
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt)
    return this;
  }
  
  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }
}