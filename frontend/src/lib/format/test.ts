import { Format } from '.';

const isLatin = (word: string) => /ə|ɪ|ɔ|ʃ/.test(word);

const isNum = (word: string) => word.includes('\u0305') || (word.length == 1 && /[0-9A-F]/.test(word));

const isAsciiNum = (word: string) => word.includes('_');

const isChinese = (word: string) =>
    /[啊诶额一奥哦无与吧白博比包波不壁怕拍破皮泡剖普屁吗没墨米猫某母密发费佛飞否缶父飞大代德地到斗度敌它太特提陶头土体那乃讷尼脑诺奴女拉来乐里洛咯路吕咋在则即早走足句擦才册其错草粗去洒赛色习所搜宿序尬改个级高勾古举卡开克七考口库区哈海和吸好后互续杀筛舌析少手书希蜡赖勒力牢漏入雨伯坡末扶的忒呢了自次丝各可何是日]/.test(
        word
    );

export const testFormat = (word: string) => {
    if (isLatin(word)) {
        return Format.LATIN;
    }
    if (isNum(word)) {
        return Format.NUM;
    }
    if (isAsciiNum(word)) {
        return Format.ASCII_NUM;
    }
    if (isChinese(word)) {
        return Format.CHINESE;
    }
    return Format.ASCII;
};
