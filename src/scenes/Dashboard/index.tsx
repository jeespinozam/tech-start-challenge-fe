import {
    Box,
    CircularProgress,
    Collapse,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import axios, { AxiosRequestConfig } from 'axios'
import React, { useEffect, useState } from 'react'

import { invoice, responseRow } from '../../@types/reportTypes'
import { environment } from '../../environment'
import { ReportQueryParam } from '../../utils/enums'
import { calculateSubtotal, formatDate, getTotal, getTotalTitle } from '../../utils/utils'

const useRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		boxRoot: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			'& .tableRow > *': {
				borderBottom: 'unset'
			}
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120
		},
		selectEmpty: {
			marginTop: theme.spacing(2)
		}
	})
)

const ProductRow = (props: { row: invoice; index: number }) => {
	const { row } = props
	const [open, setOpen] = React.useState(false)

	return (
		<React.Fragment>
			<TableRow key={row._id} className="tableRow">
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{formatDate(row.purchaseDate)}
				</TableCell>
				<TableCell>{row.invoiceNumber}</TableCell>
				<TableCell>{row.customer.name}</TableCell>
				<TableCell>{row.distributor.name}</TableCell>
				<TableCell>{row.detail.length}</TableCell>
				<TableCell>{row.totalPurchases}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Products
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell>Product Code</TableCell>
										<TableCell>Product Name</TableCell>
										<TableCell>Unit Measure</TableCell>
										<TableCell>Qty/Weight</TableCell>
										<TableCell>Unit Price</TableCell>
										<TableCell align="right">Subtotal</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.detail.map((invoiceDetail, invoiceDetailIndex) => (
										<TableRow>
											<TableCell component="th" scope="row">
												{invoiceDetailIndex + 1}
											</TableCell>
											<TableCell>{invoiceDetail.product.productCode}</TableCell>
											<TableCell>{invoiceDetail.product.description}</TableCell>
											<TableCell>{invoiceDetail.unitOfMeasure}</TableCell>
											<TableCell>{invoiceDetail.qty || invoiceDetail.weight}</TableCell>
											<TableCell>{invoiceDetail.unitPrice}</TableCell>
											<TableCell>{calculateSubtotal(invoiceDetail)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

const InvoiceRow = (props: { row: responseRow; index: number; groupBy: ReportQueryParam }) => {
	const { row, index, groupBy } = props
	const [open, setOpen] = React.useState(false)

	return (
		<React.Fragment>
			<TableRow className="tableRow">
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{index}
				</TableCell>
				<TableCell>{row.name}</TableCell>
				<TableCell>{getTotal(row, groupBy)}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Invoices
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Invoice #</TableCell>
										<TableCell>Customer</TableCell>
										<TableCell>Distributor</TableCell>
										<TableCell align="right">#products</TableCell>
										<TableCell align="right">Total (S/.)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.invoices.map((invoice, invoiceIndex) => (
										<ProductRow
											key={invoice._id}
											row={invoice}
											index={invoiceIndex}></ProductRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

export const Dashboard = () => {
	const [rows, setRows] = useState<responseRow[]>([])
	const [loading, setLoading] = useState(false)
	const [groupBy, setGroupBy] = React.useState(ReportQueryParam.customer)
	const classes = useRowStyles()

	useEffect(() => {
		setGroupBy(ReportQueryParam.customer)
		getData()
	}, [])

	const getData = async (groupedBy: ReportQueryParam = ReportQueryParam.customer) => {
		setLoading(true)
		const options: AxiosRequestConfig = {
			method: 'get',
			url: `${environment.BE_ENDPOINT}/report?groupedBy=${groupedBy}`
		}
		const res = await axios.request(options)
		setLoading(false)
		if (res?.status === 200) setRows((res.data?.data as responseRow[]) || [])
		else setRows([])
	}

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		const opt = event.target.value as ReportQueryParam
		setGroupBy(opt)
		getData(opt)
	}

	return (
		<Box className={classes.boxRoot}>
			{loading && <CircularProgress />}
			{!loading && (
				<Box width="90%">
					<Typography variant="h3">Invoices Report</Typography>

					<FormControl className={classes.formControl}>
						<InputLabel id="demo-simple-select-label">Group By</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={groupBy}
							onChange={handleChange}>
							{/* {Object.values(ReportQueryParam).map((selectOpt) => (
								<MenuItem value={selectOpt}>{capitalize(selectOpt)}</MenuItem>
							))} */}
							<MenuItem value={ReportQueryParam.invoice}>Invoice</MenuItem>
							<MenuItem value={ReportQueryParam.customer}>Customer Location</MenuItem>
							<MenuItem value={ReportQueryParam.distributor}>Distributor</MenuItem>
							<MenuItem value={ReportQueryParam.product}>Product</MenuItem>
						</Select>
					</FormControl>

					<TableContainer component={Paper}>
						<Table aria-label="collapsible table">
							<TableHead>
								<TableRow>
									<TableCell />
									<TableCell>#</TableCell>
									<TableCell>Name</TableCell>
									<Tooltip title="Total of invoices below" aria-label="add" placement="top">
										<TableCell>{getTotalTitle(groupBy)}</TableCell>
									</Tooltip>
								</TableRow>
							</TableHead>
							<TableBody>
								{rows &&
									rows.map((row, index) => (
										<InvoiceRow key={row._id} row={row} index={index + 1} groupBy={groupBy} />
									))}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			)}
		</Box>
	)
}
