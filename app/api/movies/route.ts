// app/api/movies/route.js
//api/movies/:idMovie - (GET-POST-PUT-DELETE) Récupérer/Ajouter/Modifier/Supprimer un film via son ID
import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// app/api/movies/route.ts

// ...

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Récupère une liste de films
 *     description: Renvoie une liste des 10 premiers films stockés dans la base de données.
 *     responses:
 *       200:
 *         description: Succès - Liste des films retournée.
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
 *                         example: "60b8d295f72e4b0015c9e950"
 *                       title:
 *                         type: string
 *                         example: "Inception"
 *                       director:
 *                         type: string
 *                         example: "Christopher Nolan"
 *                       year:
 *                         type: integer
 *                         example: 2010
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function GET(): Promise<NextResponse> {
  try {
    //initialize the client and select the db
    //access the collection and find select at least 10 movies with the method find
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const movies = await db.collection('movies').find({}).limit(10).toArray();
    
    return NextResponse.json(
	    { status: 200, data: movies }
		);
  }
  catch (error: any) {
    return NextResponse.json(
	    { status: 500, message: 'Internal Server Error', error: error.message }
    );
  }
}

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Ajoute un nouveau film
 *     description: Insère un nouveau film dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Interstellar"
 *               director:
 *                 type: string
 *                 example: "Christopher Nolan"
 *               year:
 *                 type: integer
 *                 example: 2014
 *     responses:
 *       201:
 *         description: Film ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Movie created"
 *                 data:
 *                   type: object
 *       400:
 *         description: Données invalides ou champs manquants.
 *       500:
 *         description: Erreur interne du serveur.
 */


export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const body = await request.json();
    if (!body.title || !body.director || !body.year) {
      return NextResponse.json({ status: 400, message: 'Invalid request body', error: 'Missing required fields' });
    }
    // create a new movie with the data and the method insertOne
    const result = await db.collection('movies').insertOne(body);
    return NextResponse.json({ status: 201, message: 'Movie created', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/movies/{idMovie}:
 *   put:
 *     summary: Met à jour un film
 *     description: Modifie un film existant dans la base de données en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: ID du film à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               director:
 *                 type: string
 *                 example: "Christopher Nolan"
 *               year:
 *                 type: integer
 *                 example: 2010
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Movie updated"
 *                 data:
 *                   type: object
 *       400:
 *         description: ID du film invalide.
 *       404:
 *         description: Film non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }

    const body = await request.json();
    //update the movie with the new data because of findOneAndUpdate 
    const updatedMovie = await db.collection('movies').findOneAndUpdate(
      { _id: new ObjectId(idMovie) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!updatedMovie || !updatedMovie.value) {
      return NextResponse.json({ status: 404, message: 'Movie not found' });
    }

    return NextResponse.json({ status: 200, message: 'Movie updated', data: updatedMovie.value });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
/**
 * @swagger
 * /api/movies/{idMovie}:
 *   delete:
 *     summary: Supprime un film
 *     description: Supprime un film existant en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: ID du film à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film supprimé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Movie deleted"
 *       400:
 *         description: ID du film invalide.
 *       404:
 *         description: Film non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID' });
    }
    //delete the movie with the method deleteOne with the idMovie as a parameter
    const deletedMovie = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });

    if (deletedMovie.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Movie not found' });
    }

    return NextResponse.json({ status: 200, message: 'Movie deleted' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}


