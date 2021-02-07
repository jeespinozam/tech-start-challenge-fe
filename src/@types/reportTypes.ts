export type invoice = {
	_id: string
	customer_id: string
	customer: user
	distributor: user
	detail: Array<invoice_detail>
	distributor_id: string
	invoiceNumber: number
	owner_id: string
	purchaseDate: Date
	totalPurchases: number
}

export type invoice_detail = {
	_id: string
	product: Partial<product>
	qty: number
	unitOfMeasure: string
	unitPrice: number
	weight: number
}

export type product = {
	_id: string
	description: string
	distributor_id: string
	manufacturer_id: string
	owner_id: string
	productCode: string
}

export type user = {
	_id: string
	address: string
	name: string
	owner_id: string
	type: string
}

export type responseRow = {
	_id: string
	name: string
	invoices: invoice[]
}
