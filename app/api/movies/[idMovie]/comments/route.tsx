// app/api/movies/[idMovie]/comments/route.ts
// Partie 3: /api/movies/:idMovie/comments - (GET) Récupérer la liste de tous les commentaires liés à un film

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     summary: Retrieve comments for a specific movie
 *     description: Fetches all comments related to the given movie ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f3a1b2c3d4e5f6789abcde"
 *                       movie_id:
 *                         type: string
 *                         example: "60d5ec49f72d7e001cb3e4b2"
 *                       text:
 *                         type: string
 *                         example: "Great movie, I loved it!"
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-31T12:34:56Z"
 *       400:
 *         description: Invalid movie ID format
 *       404:
 *         description: No comments found for this movie
 *       500:
 *         description: Internal Server Error
 */

export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    // Get the client
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    // Get the movie ID from the params
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }

    // Get the comments for the movie
    const comments = await db.collection('comments').find({ movie_id: new ObjectId(idMovie) }).toArray();

    if (comments.length === 0) { 
      return NextResponse.json({ status: 404, message: 'No comments found for this movie', error: 'No comments available' });
    }

    // Return the comments
    return NextResponse.json({ status: 200, data: { comments } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
