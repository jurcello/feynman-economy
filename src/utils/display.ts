const moneyFormatter = (value: number) => {
    if (value >= 1000000000) {
        return `€ ${(value / 1000000000).toFixed(1)}b`
    }
    if (value >= 1000000) {
        return `€ ${(value / 1000000).toFixed(1)}m`
    }
    if (value >= 1000) {
        return `€ ${(value / 1000).toFixed(1)}k`
    }
    return `€ ${value}`
}
export {moneyFormatter}