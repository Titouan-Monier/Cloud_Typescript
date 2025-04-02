// app/api/comments/[idComment]/route.ts
// /api/comments/:idComment - (GET, POST, PUT, DELETE) Gérer un commentaire spécifique

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/comments/{idComment}:
 *   get:
 *     summary: Obtenir un commentaire par ID
 *     description: Fetch a comment using its unique ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment
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
 *                       example: "65f3a1b2c3d4e5f6789abcde"
 *                     movie_id:
 *                       type: string
 *                       example: "60d5ec49f72d7e001cb3e4b2"
 *                     text:
 *                       type: string
 *                       example: "Great movie, I loved it!"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-31T12:34:56Z"
 *       400:
 *         description: Invalid comment ID format
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal Server Error
 * 
 *   post:
 *     summary: Add a new comment
 *     description: Créé unj nouveau commentaire.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movie_id:
 *                 type: string
 *                 example: "60d5ec49f72d7e001cb3e4b2"
 *               text:
 *                 type: string
 *                 example: "This movie was amazing!"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-03-31T12:34:56Z"
 *     responses:
 *       201:
 *         description: Comment successfully created
 *       500:
 *         description: Internal Server Error
 * 
 *   put:
 *     summary: Update a comment
 *     description: Met à jour un commentaire.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Actually, this movie was just okay."
 *     responses:
 *       200:
 *         description: Comment successfully updated
 *       400:
 *         description: Invalid comment ID format
 *       500:
 *         description: Internal Server Error
 * 
 *   delete:
 *     summary: Delete a comment
 *     description: Supprime suivant l'id.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment successfully deleted
 *       400:
 *         description: Invalid comment ID format
 *       500:
 *         description: Internal Server Error
 */

export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }
    //findOne to get the comment by a specific id
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

// Add a new comment
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const newComment = await request.json();
    //insertOne to add a new comment
    const result = await db.collection('comments').insertOne(newComment);
    return NextResponse.json({ status: 201, data: { insertedId: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

// Update a comment
export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;
    
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }
    //take the data from the request body and update the comment
    const updateData = { $set: await request.json() };
    const result = await db.collection('comments').updateOne({ _id: new ObjectId(idComment) }, updateData);
    return NextResponse.json({ status: 200, data: { modifiedCount: result.modifiedCount } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

// Delete a comment
export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;
    
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }
    //deleteOne to delete the comment from the db 
    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });
    return NextResponse.json({ status: 200, data: { deletedCount: result.deletedCount } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

