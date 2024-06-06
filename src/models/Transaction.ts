import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    userId: string;
    orderId: string;
    paymentId?: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        orderId: { type: String, required: true },
        paymentId: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        status: { type: String, required: true, enum: ['created', 'paid'], default: 'created' }
    },
    { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
