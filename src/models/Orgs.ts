import { Schema, Document, Model, Types, model } from 'mongoose'
const schemaOptions = {
  collection: 'orgs',
  timestamps: true,
}

export interface OrgsI {
  name: string
}

export interface OrgsDoc extends Document, OrgsI {
  users: Types.Array<string>
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OrgsModel extends Model<OrgsDoc> {}

const OrgsSchema = new Schema<OrgsDoc, OrgsModel>(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      require: 'organization name required',
    },
    users: [
      {
        type: String,
        index: true,
      },
    ],
  },
  schemaOptions,
)

export default model<OrgsDoc, OrgsModel>('orgs', OrgsSchema)
