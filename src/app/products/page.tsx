import { calculateTotal } from "./calculateTotal"

export default function ProductPage(){
    const total = calculateTotal(500, 3)

    return (<div>
        <h1>Products</h1>
        <p>Total: {total}</p>
    </div>)
}

