import {Bool, Member} from "../../api/pb/goodguy-web_pb";

export default function ConstructMember(
    sid?: string, name?: string, school?: string, grade?: string, clazz?: string, email?: string, codeforces?: string,
    atcoder?: string, codechef?: string, nowcoder?: string, vjudge?: string, leetcode?: string, luogu?: string,
    isSubscribe?: Bool) {
    const member = new Member();
    if (sid !== undefined) {
        member.setSid(sid);
    }
    if (name !== undefined) {
        member.setName(name);
    }
    if (school !== undefined) {
        member.setSchool(school);
    }
    if (grade !== undefined) {
        member.setGrade(Number(grade));
    }
    if (clazz !== undefined) {
        member.setClazz(clazz);
    }
    if (email !== undefined) {
        member.setEmail(email);
    }
    if (codeforces !== undefined) {
        member.setCodeforcesId(codeforces);
    }
    if (atcoder !== undefined) {
        member.setAtcoderId(atcoder);
    }
    if (codechef !== undefined) {
        member.setCodechefId(codechef);
    }
    if (nowcoder !== undefined) {
        member.setNowcoderId(nowcoder);
    }
    if (vjudge !== undefined) {
        member.setVjudgeId(vjudge);
    }
    if (leetcode !== undefined) {
        member.setLeetcodeId(leetcode);
    }
    if (luogu !== undefined) {
        member.setLuoguId(luogu);
    }
    if (isSubscribe !== undefined) {
        member.setIsSubscribe(isSubscribe ? Bool.BOOL_TRUE : Bool.BOOL_FALSE);
    }
    return member;
}