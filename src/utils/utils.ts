import { invoice_detail, responseRow } from '../@types/reportTypes'
import { ReportQueryParam, UnitOfMeasure } from './enums'

export const capitalize = (s: string) => {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const formatDate = (d: Date | string) => {
	if (typeof d === 'string') d = new Date(d)
	return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear()
}

export const calculateSubtotal = (invoiceDetail: invoice_detail) => {
	return (
		invoiceDetail.unitPrice *
		(invoiceDetail.unitOfMeasure === UnitOfMeasure.CASE ? invoiceDetail.qty : invoiceDetail.weight)
	)
}

export const getTotal = (row: responseRow, groupBy: ReportQueryParam) => {
	switch (groupBy) {
		case ReportQueryParam.invoice:
		case ReportQueryParam.customer:
		case ReportQueryParam.distributor:
			return row.invoices.reduce((a, b) => a + (b.totalPurchases || 0), 0)
		case ReportQueryParam.product:
			return row.invoices.reduce(
				(a, b) =>
					a +
					b.detail
						.filter((d) => d.product._id === row._id)
						.reduce((e, f) => e + calculateSubtotal(f), 0),
				0
			)
		default:
			return 0
	}
}

export const getTotalTitle = (groupBy: ReportQueryParam) => {
	switch (groupBy) {
		case ReportQueryParam.distributor:
		case ReportQueryParam.invoice:
			return 'Total (S/.)'
		case ReportQueryParam.product:
			return 'Total on invoices (S/.)'
		case ReportQueryParam.customer:
			return 'Total Purchases(S/.)'
		default:
			return 0
	}
}
