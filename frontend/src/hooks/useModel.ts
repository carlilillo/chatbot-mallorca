import { useState } from "react"


export default function useModel(models: model[]) {
    const [model, setModel] = useState<model>(models[0])

    const onclick = (event: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
        const htmlText = models
            .find(model => model.value === event.currentTarget.value)

        setModel(htmlText!)
    }

    return { model, onclick }
}