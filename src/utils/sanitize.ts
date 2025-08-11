export const isPlainObject = (v: unknown): v is Record<string, any> =>
    !!v && typeof v === "object" && !Array.isArray(v);

export const deepPrune = <T = any>(obj: T): T => {
    if (!isPlainObject(obj)) return obj;
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null || v === "") continue;
        if (Array.isArray(v)) {
            const arr = v.map(deepPrune).filter((x) => x !== undefined);
            if (arr.length) out[k] = arr;
        } else if (isPlainObject(v)) {
            const child = deepPrune(v);
            if (Object.keys(child).length) out[k] = child;
        } else {
            out[k] = v;
        }
    }
    return out as T;
};
