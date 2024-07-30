import { Categoria } from "@/components/models/Categoria"
import { consumeService } from "./utils/service"


export const createSale = async (categorias, empresaId) => {
    return await consumeService({
        url: `categoria?empresaId=${empresaId}`,
        method: 'POST',
        body: JSON.stringify(categorias)
    })
}

export const getSale = async (categoria) => {
    let route = '';
    categoria === null ? route = `categoria` : route = `categoria/${categoria}`;
    return await consumeService({
        url: route,
        method: 'GET'
    })
}

export const getSales = async (empresaId) => {
    return await consumeService({
        url: `categoria?empresaId=${empresaId}`,
        method: 'GET'
    })
}
