// app/api/theaters/route.ts
///api/theaters - (GET) Récupérer la liste de tous les théatres et cinémas

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient } from 'mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Retourne tous les théatres
 *     description: Return all the ddb theaters.
 *     responses:
 *       200:
 *         description: List of theaters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     theaters:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60a7f43e9b1e8b3a4c8e9e9a"
 *                           name:
 *                             type: string
 *                             example: "Grand Théâtre de Paris"
 *                           location:
 *                             type: string
 *                             example: "Paris, France"
 *       404:
 *         description: No theater found.
 *       500:
 *         description: Internal Servor Error.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const theaters = await db.collection('theaters').find({}).toArray();
    
    if (!theaters.length) {
      return NextResponse.json({ status: 404, message: 'No theaters found', error: 'No data available' });
    }
    
    return NextResponse.json({ status: 200, data: { theaters } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
