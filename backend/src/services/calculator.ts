export interface RiceGrain {
    length: number;
    weight: number;
    shape: string;
    type: string;
}

export interface SubStandard {
    key: string;
    name: string;
    maxLength: number;
    minLength: number;
    conditionMax: string;
    conditionMin: string;
    shape: string[];
}

// ฟังก์ชันช่วยเช็คเงื่อนไข (LT, LE, GT, GE)
const checkCondition = (length: number, condition: string, targetLength: number): boolean => {
    switch (condition) {
        case 'LT': return length < targetLength;   // Less Than
        case 'LE': return length <= targetLength;  // Less Equal
        case 'GT': return length > targetLength;   // Greater Than
        case 'GE': return length >= targetLength;  // Greater Equal
        default: return false;
    }
};

export const calculateInspection = (rawGrains: RiceGrain[], standards: SubStandard[]) => {
    // 1. หาน้ำหนักรวมทั้งหมด (Total Weight) ของตัวอย่างข้าว
    const totalWeight = rawGrains.reduce((sum, grain) => sum + grain.weight, 0);

    if (totalWeight === 0) return { composition: [], defect: [] };

    // 2. คำนวณหมวด Composition (รูปร่าง) ตามที่ Standard กำหนดมา
    const compositionResult = standards.map((std) => {
        const filteredGrains = rawGrains.filter((grain) => {
            const isShapeMatch = std.shape.includes(grain.shape);
            const isMinPass = checkCondition(grain.length, std.conditionMin, std.minLength);
            const isMaxPass = checkCondition(grain.length, std.conditionMax, std.maxLength);
            return isShapeMatch && isMinPass && isMaxPass;
        });

        const weightSum = filteredGrains.reduce((sum, grain) => sum + grain.weight, 0);
        const actualPercentage = (weightSum / totalWeight) * 100;

        return {
            // 🔴 จุดที่ 1: เปลี่ยนจาก std.name เป็น std.key เพื่อส่งรหัสคำไปให้หน้าบ้านแปลภาษา
            name: std.key,
            actual: parseFloat(actualPercentage.toFixed(2))
        };
    });

    // 3. คำนวณหมวด Defect (จุดบกพร่อง)
    const defectTypes = ["yellow", "chalky", "paddy", "red", "damage", "glutinous"];
    const defectResult = defectTypes.map((defectType) => {
        const filteredGrains = rawGrains.filter(grain => grain.type === defectType);
        const weightSum = filteredGrains.reduce((sum, grain) => sum + grain.weight, 0);
        const actualPercentage = (weightSum / totalWeight) * 100;

        return {
            name: defectType,
            actual: parseFloat(actualPercentage.toFixed(2))
        };
    });

    const foreignGrains = rawGrains.filter(grain => grain.type !== 'white');
    const foreignWeightSum = foreignGrains.reduce((sum, grain) => sum + grain.weight, 0);

    defectResult.push({
        name: "total_defect",
        actual: parseFloat(((foreignWeightSum / totalWeight) * 100).toFixed(2))
    });

    return {
        composition: compositionResult,
        defect: defectResult,
        totalSample: rawGrains.length
    };
};