import { Schema, model, Types, Document, Model } from 'mongoose'
import { OrgsDoc } from '.'

/*** ENUMS ***/
export enum DSStatus {
  VERIFIED = 'verified',
  NODATA = 'no data',
  ISSUE = 'issue',
  ERROR = 'error',
}

// priority of errors for output reproting
export const sheetStatusPriority: Readonly<DSStatus[]> = [
  DSStatus.VERIFIED,
  DSStatus.NODATA,
  DSStatus.ISSUE,
  DSStatus.ERROR,
]

// base interfaces used for creating documents with strong typing
export interface SheetStructure {
  name: string
  columns: string[]
}
export interface DataSourceType {
  status: DSStatus
  stockName?: string
  useAlias: boolean
  fileStructure: SheetStructure[]
  columnRef: Map<string, string>
  lastImported: Date
  firstImported: Date
  organizationId: OrgsDoc['_id']
}

// Put Mongo Interfaces back for use of mongo methods
export interface SheetStructureDoc extends SheetStructure {
  columns: Types.Array<string>
}
export interface DataSourceDoc extends Document, DataSourceType {
  fileStructure: Types.Array<SheetStructureDoc>
  columnRef: Types.Map<string>
}

// Finally Add Statics in a Model version
export interface DataSourceModel extends Model<DataSourceDoc> {
  getByStockName(stockName: string): Promise<DataSourceDoc>
}

const sheetStructure = {
  name: String,
  columns: [String],
}

const schemaOptions = {
  collection: 'dataSource',
  timestamps: true,
}

const DataSourceSchema = new Schema<DataSourceDoc, DataSourceModel>(
  {
    status: {
      type: String,
      default: DSStatus.NODATA,
      index: true,
    },
    stockName: {
      type: String,
      default: '',
    },
    fileStructure: [sheetStructure],
    columnRef: {
      type: Map,
      of: String,
    },
    lastImported: {
      type: Date,
      default: null,
    },
    firstImported: {
      type: Date,
      default: null,
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'orgSettings', required: true },
  },
  schemaOptions,
)

DataSourceSchema.statics.getByStockName = async function (
  this: Model<DataSourceDoc>,
  stockName: string,
): Promise<DataSourceDoc> {
  return this.findOne({ stockName })
}

export default model<DataSourceDoc, DataSourceModel>('dataSource', DataSourceSchema)
