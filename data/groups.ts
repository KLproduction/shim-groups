"use server"

import { db } from "@/lib/db"

export const onGetAffiliateInfo = async (id: string) => {
    try {
        const affiliateInfo = await db.affiliate.findFirst({
            where: {
                id,
            },
            select: {
                Group: {
                    select: {
                        User: {
                            select: {
                                name: true,
                                image: true,
                                id: true,
                                stripeId: true,
                            },
                        },
                    },
                },
            },
        })

        if (affiliateInfo) {
            return { status: 200, user: affiliateInfo }
        }

        return { status: 404 }
    } catch (error) {
        return { status: 400 }
    }
}
