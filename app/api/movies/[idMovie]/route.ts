// page/api/movies/[idMovie]/route.ts
//api/movies - (GET) Récupérer tous les films

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
/**
 * @swagger
 * /api/movies/{idMovie}:
 *   get:
 *     summary: Récupère un film par son ID
 *     description: Retourne un film spécifique en fonction de son ID unique.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film à récupérer.
 *     responses:
 *       200:
 *         description: Film récupéré avec succès.
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
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f4f1a256b8d6f34a9"
 *                     title:
 *                       type: string
 *                       example: "Inception"
 *                     director:
 *                       type: string
 *                       example: "Christopher Nolan"
 *                     year:
 *                       type: integer
 *                       example: 2010
 *       400:
 *         description: ID du film invalide.
 *       404:
 *         description: Film non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function GET(request: Request, { params }: {params : any}): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
