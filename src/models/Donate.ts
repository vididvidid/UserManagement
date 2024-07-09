import mongoose, { Schema, Document } from 'mongoose';

export interface IDonate extends Document {
    userId: string;
    orderId: string;
    paymentId?: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    donorName?: string;
    donorEmail?: string;
    donorMessage?: string;
}

const DonateSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User'},
        orderId: { type: String, required: true },
        paymentId: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        status: { type: String, required: true, default: 'created' },
        donorName: { type: String },
        donorEmail: { type: String },
        donorMessage: { type: String }
    },
    { timestamps: true }
);

const Donate = mongoose.model<IDonate>('Donate', DonateSchema);

export default Donate;
