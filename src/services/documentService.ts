import { PrismaClient, Document } from '@prisma/client';

const prisma = new PrismaClient();

export class DocumentService {
  /**
   * Create a new document
   */
  async createDocument(documentData: {
    title: string;
    driveFileId: string;
    driveParentId?: string;
    driveLink: string;
    documentType: string;
    lastEdited: Date;
    createdBy?: string;
  }): Promise<Document> {
    return prisma.document.create({
      data: documentData,
    });
  }

  /**
   * Find documents older than a given threshold (for archiving)
   */
  async findDocumentsForArchiving(thresholdDays = 730): Promise<Document[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);

    return prisma.document.findMany({
      where: {
        lastEdited: {
          lt: thresholdDate,
        },
        documentType: {
          not: 'archive',
        },
      },
    });
  }

  /**
   * Mark a document as archived
   */
  async markAsArchived(id: number): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data: {
        documentType: 'archive',
      },
    });
  }
}
