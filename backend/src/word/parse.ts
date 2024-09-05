const isLatin = (word: string) => /ə|ɪ|ɔ|ʃ|ø/.test(word);

const isNum = (word: string) => word.includes('\u0305') || (word.length == 1 && /[0-9A-F]/.test(word));

const isAsciiNum = (word: string) => word.includes('_');

const isChinese = (word: string) =>
    /[啊诶额一奥哦无与吧白博比包波不壁怕拍破皮泡剖普屁吗没墨米猫某母密发费佛飞否缶父飞大代德地到斗度敌它太特提陶头土体那乃讷尼脑诺奴女拉来乐里洛咯路吕咋在则即早走足句擦才册其错草粗去洒赛色习所搜宿序尬改个级高勾古举卡开克七考口库区哈海和吸好后互续杀筛舌析少手书希蜡赖勒力牢漏入雨伯坡末扶的忒呢了自次丝各可何是日]/.test(
        word
    );

const latinToAscii = (word: string) =>
    word.replace(/ə/g, 'ee').replace(/ɪ/g, 'i').replace(/ɔ/g, 'oo').replace(/ʃ/g, 'sh').replace(/ø/g, 'y');

const chineseToAscii = (word: string) =>
    word
        .replace(/啊/g, 'a')
        .replace(/诶/g, 'e')
        .replace(/额/g, 'ee')
        .replace(/一/g, 'i')
        .replace(/奥/g, 'oo')
        .replace(/哦/g, 'o')
        .replace(/无/g, 'u')
        .replace(/与/g, 'y')
        .replace(/吧/g, 'ba')
        .replace(/白/g, 'be')
        .replace(/博/g, 'bee')
        .replace(/比/g, 'bi')
        .replace(/包/g, 'boo')
        .replace(/波/g, 'bo')
        .replace(/不/g, 'bu')
        .replace(/壁/g, 'by')
        .replace(/怕/g, 'pa')
        .replace(/拍/g, 'pe')
        .replace(/破/g, 'pee')
        .replace(/皮/g, 'pi')
        .replace(/泡/g, 'poo')
        .replace(/剖/g, 'po')
        .replace(/普/g, 'pu')
        .replace(/屁/g, 'py')
        .replace(/吗/g, 'ma')
        .replace(/没/g, 'me')
        .replace(/墨/g, 'mee')
        .replace(/米/g, 'mi')
        .replace(/猫/g, 'moo')
        .replace(/某/g, 'mo')
        .replace(/母/g, 'mu')
        .replace(/密/g, 'my')
        .replace(/发/g, 'fa')
        .replace(/费/g, 'fe')
        .replace(/佛/g, 'fee')
        .replace(/飞/g, 'fi')
        .replace(/否/g, 'foo')
        .replace(/缶/g, 'fo')
        .replace(/父/g, 'fu')
        .replace(/飞/g, 'fy')
        .replace(/大/g, 'da')
        .replace(/代/g, 'de')
        .replace(/德/g, 'dee')
        .replace(/地/g, 'di')
        .replace(/到/g, 'doo')
        .replace(/斗/g, 'do')
        .replace(/度/g, 'du')
        .replace(/敌/g, 'dy')
        .replace(/它/g, 'ta')
        .replace(/太/g, 'te')
        .replace(/特/g, 'tee')
        .replace(/提/g, 'ti')
        .replace(/陶/g, 'too')
        .replace(/头/g, 'to')
        .replace(/土/g, 'tu')
        .replace(/体/g, 'ty')
        .replace(/那/g, 'na')
        .replace(/乃/g, 'ne')
        .replace(/讷/g, 'nee')
        .replace(/尼/g, 'ni')
        .replace(/脑/g, 'noo')
        .replace(/诺/g, 'no')
        .replace(/奴/g, 'nu')
        .replace(/女/g, 'ny')
        .replace(/拉/g, 'la')
        .replace(/来/g, 'le')
        .replace(/乐/g, 'lee')
        .replace(/里/g, 'li')
        .replace(/洛/g, 'loo')
        .replace(/咯/g, 'lo')
        .replace(/路/g, 'lu')
        .replace(/吕/g, 'ly')
        .replace(/咋/g, 'za')
        .replace(/在/g, 'ze')
        .replace(/则/g, 'zee')
        .replace(/即/g, 'zi')
        .replace(/早/g, 'zoo')
        .replace(/走/g, 'zo')
        .replace(/足/g, 'zu')
        .replace(/句/g, 'zy')
        .replace(/擦/g, 'ca')
        .replace(/才/g, 'ce')
        .replace(/册/g, 'cee')
        .replace(/其/g, 'ci')
        .replace(/错/g, 'coo')
        .replace(/草/g, 'co')
        .replace(/粗/g, 'cu')
        .replace(/去/g, 'cy')
        .replace(/洒/g, 'sa')
        .replace(/赛/g, 'se')
        .replace(/色/g, 'see')
        .replace(/习/g, 'si')
        .replace(/所/g, 'soo')
        .replace(/搜/g, 'so')
        .replace(/宿/g, 'su')
        .replace(/序/g, 'sy')
        .replace(/尬/g, 'ga')
        .replace(/改/g, 'ge')
        .replace(/个/g, 'gee')
        .replace(/级/g, 'gi')
        .replace(/高/g, 'goo')
        .replace(/勾/g, 'go')
        .replace(/古/g, 'gu')
        .replace(/举/g, 'gy')
        .replace(/卡/g, 'ka')
        .replace(/开/g, 'ke')
        .replace(/克/g, 'kee')
        .replace(/七/g, 'ki')
        .replace(/考/g, 'koo')
        .replace(/口/g, 'ko')
        .replace(/库/g, 'ku')
        .replace(/区/g, 'ky')
        .replace(/哈/g, 'ha')
        .replace(/海/g, 'he')
        .replace(/和/g, 'hee')
        .replace(/吸/g, 'hi')
        .replace(/好/g, 'hoo')
        .replace(/后/g, 'ho')
        .replace(/互/g, 'hu')
        .replace(/续/g, 'hy')
        .replace(/杀/g, 'sha')
        .replace(/筛/g, 'she')
        .replace(/舌/g, 'shee')
        .replace(/析/g, 'shi')
        .replace(/少/g, 'shoo')
        .replace(/手/g, 'sho')
        .replace(/书/g, 'shu')
        .replace(/希/g, 'shy')
        .replace(/蜡/g, 'ra')
        .replace(/赖/g, 're')
        .replace(/勒/g, 'ree')
        .replace(/力/g, 'ri')
        .replace(/牢/g, 'roo')
        .replace(/漏/g, 'ro')
        .replace(/入/g, 'ru')
        .replace(/雨/g, 'ry')
        .replace(/伯/g, 'b')
        .replace(/坡/g, 'p')
        .replace(/末/g, 'm')
        .replace(/扶/g, 'f')
        .replace(/的/g, 'd')
        .replace(/忒/g, 't')
        .replace(/呢/g, 'n')
        .replace(/了/g, 'l')
        .replace(/自/g, 'z')
        .replace(/次/g, 'c')
        .replace(/丝/g, 's')
        .replace(/各/g, 'g')
        .replace(/可/g, 'k')
        .replace(/何/g, 'h')
        .replace(/是/g, 'sh')
        .replace(/日/g, 'r');

const numVowelTable = ['a', 'e', 'ee', 'i', 'oo', 'o', 'u', 'y'];

const numConsonantTable = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'z', 'c', 's', 'g', 'k', 'h', 'sh', 'r'];

const numToAscii = (word: string) => {
    for (let i = 0; i < numVowelTable.length; i++) {
        word = word.replace(new RegExp(`${i.toString(16).toUpperCase()}\u0305`, 'g'), numVowelTable[i]);
    }
    for (let i = 0; i < numConsonantTable.length; i++) {
        word = word.replace(new RegExp(i.toString(16).toUpperCase(), 'g'), numConsonantTable[i]);
    }
    return word;
};

const asciiNumToAscii = (word: string) => {
    for (let i = 0; i < numVowelTable.length; i++) {
        word = word.replace(new RegExp(`_${i.toString(16).toUpperCase()}`, 'g'), numVowelTable[i]);
    }
    for (let i = 0; i < numConsonantTable.length; i++) {
        word = word.replace(new RegExp(i.toString(16).toUpperCase(), 'g'), numConsonantTable[i]);
    }
    return word;
};

type Consonant = 'b' | 'p' | 'm' | 'f' | 'd' | 't' | 'n' | 'l' | 'z' | 'c' | 's' | 'g' | 'k' | 'h' | 'sh' | 'r';
type Vowel = 'a' | 'e' | 'ee' | 'i' | 'oo' | 'o' | 'u' | 'y';

export interface ParsedWord {
    type: Consonant | '';
    units: `${Consonant}${Vowel}`[];
}

enum State {
    INITIAL,
    READ_CONSONANT,
    READ_VOWEL,
}

const consonantLetters = 'bpmfdtnlzcsgkhr';
const vowelLetters = 'aeiouy';

function checkUnits(units: string[]): units is `${Consonant}${Vowel}`[] {
    if (units.length == 0) {
        return false;
    }
    if (/^[aeiouy]/.test(units[0])) {
        units[0] = `b${units[0]}`;
    }
    for (const unit of units) {
        if (!/^(b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)(a|e|ee|i|oo|o|u|y)$/.test(unit)) {
            return false;
        }
    }
    return true;
}

function checkConsonant(unit: string): unit is Consonant {
    if (unit.length == 0) {
        return true;
    }
    return /^(b|p|m|f|d|t|n|l|z|c|s|g|k|h|sh|r)$/.test(unit);
}

export const parseWord: (word: string) => ParsedWord = (word) => {
    if (isLatin(word)) {
        word = latinToAscii(word);
    } else if (isNum(word)) {
        word = numToAscii(word);
    } else if (isAsciiNum(word)) {
        word = asciiNumToAscii(word);
    } else if (isChinese(word)) {
        word = chineseToAscii(word);
    }

    let state = State.INITIAL;
    const units: string[] = [];

    let tempUnit = '';

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (state == State.INITIAL) {
            if (consonantLetters.includes(char)) {
                tempUnit += char;
                state = State.READ_CONSONANT;
            } else if (vowelLetters.includes(char)) {
                tempUnit += char;
                state = State.READ_VOWEL;
            } else {
                throw Error('invalid word');
            }
        } else if (state == State.READ_CONSONANT) {
            if (consonantLetters.includes(char)) {
                tempUnit += char;
            } else if (vowelLetters.includes(char)) {
                tempUnit += char;
                state = State.READ_VOWEL;
            } else {
                throw Error('invalid word');
            }
        } else {
            if (consonantLetters.includes(char)) {
                units.push(consonantLetters.includes(tempUnit[0]) ? tempUnit : `b${tempUnit}`);
                tempUnit = char;
                state = State.READ_CONSONANT;
            } else if (vowelLetters.includes(char)) {
                tempUnit += char;
            } else {
                throw Error('invalid word');
            }
        }
    }

    if (!checkConsonant(tempUnit)) {
        units.push(tempUnit);
        tempUnit = '';
    }

    if (!checkUnits(units)) {
        throw Error('invalid word');
    }

    if (!checkConsonant(tempUnit)) {
        throw Error('invalid word');
    }

    return {
        type: tempUnit,
        units,
    };
};
