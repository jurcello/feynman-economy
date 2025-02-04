import {ref} from "vue";
import {Reactive, reactive, Ref} from "@vue/runtime-core";

export type VariableInformation = {
    name: string;
    reCalculator: () => void,
    value: Ref<number>,
    label: string,
    min: number,
    max: number,
    step: number,
};

class Formula {
    name: string;
    formulaInTex: string;
    private components: Map<string, VariableInformation> = new Map<string, VariableInformation>();
    public currentReactable: string;

    public static create(name: string, formulaInTex: string, components: VariableInformation[]): Reactive<Formula> {
        return reactive(new Formula(name, formulaInTex, components));
    }
    private constructor(name: string, formulaInTex: string, components: VariableInformation[]) {
        this.name = name;
        this.formulaInTex = formulaInTex;
        for (const varInfoElement of components) {
            this.components.set(varInfoElement.name, varInfoElement);
        }
        console.log(this.getComponents());
        this.currentReactable = this.getComponents()[0].name;
    }

    public getComponents(): VariableInformation[] {
        return [... this.components.values()];
    }

    public calculateNewValues(): void {
        console.log("calculateNewValues", this.components, this.currentReactable);
        this.components.get(this.currentReactable)?.reCalculator()
    }
}

export default Formula;