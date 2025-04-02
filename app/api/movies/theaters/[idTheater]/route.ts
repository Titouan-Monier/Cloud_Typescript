// app/api/theaters/[idTheater]/route.ts
///api/theaters/:idTheater - (GET-POST-PUT-DELETE) Récupérer/Ajouter/Modifier/Supprimer théatre ou un cinéma selon son ID

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   get:
 *     summary: Récupère un théâtre spécifique
 *     description: Retourne les détails d'un théâtre en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à récupérer.
 *     responses:
 *       200:
 *         description: Succès - Théâtre trouvé.
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
 *                       example: "60b8d295f72e4b0015c9e950"
 *                     name:
 *                       type: string
 *                       example: "Grand Rex"
 *                     location:
 *                       type: object
 *                       properties:
 *                         address:
 *                           type: string
 *                           example: "1 Boulevard Poissonnière, 75002 Paris"
 *                         city:
 *                           type: string
 *                           example: "Paris"
 *       400:
 *         description: ID du théâtre invalide.
 *       404:
 *         description: Théâtre non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });
    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Ajoute un nouveau théâtre
 *     description: Insère un nouveau théâtre dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ciné Gaumont"
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "3 Rue du Cinéma, 75001 Paris"
 *                   city:
 *                     type: string
 *                     example: "Paris"
 *     responses:
 *       201:
 *         description: Théâtre ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     insertedId:
 *                       type: string
 *                       example: "60b8d295f72e4b0015c9e951"
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const newTheater = await request.json();

    const result = await db.collection('theaters').insertOne(newTheater);
    return NextResponse.json({ status: 201, data: { insertedId: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   put:
 *     summary: Met à jour un théâtre
 *     description: Met à jour les informations d'un théâtre existant dans la base de données.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à mettre à jour.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ciné Gaumont"
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     example: "3 Rue du Cinéma, 75001 Paris"
 *                   city:
 *                     type: string
 *                     example: "Paris"
 *     responses:
 *       200:
 *         description: Théâtre mis à jour avec succès.
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
 *                     modifiedCount:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: ID du théâtre invalide.
 *       404:
 *         description: Théâtre non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;
    
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const updateData = { $set: await request.json() };
    const result = await db.collection('theaters').updateOne({ _id: new ObjectId(idTheater) }, updateData);
    return NextResponse.json({ status: 200, data: { modifiedCount: result.modifiedCount } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters/{idTheater}:
 *   delete:
 *     summary: Supprime un théâtre
 *     description: Supprime un théâtre de la base de données en fonction de son ID.
 *     parameters:
 *       - in: path
 *         name: idTheater
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du théâtre à supprimer.
 *     responses:
 *       200:
 *         description: Théâtre supprimé avec succès.
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
 *                     deletedCount:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: ID du théâtre invalide.
 *       404:
 *         description: Théâtre non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idTheater } = params;
    
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });
    return NextResponse.json({ status: 200, data: { deletedCount: result.deletedCount } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
