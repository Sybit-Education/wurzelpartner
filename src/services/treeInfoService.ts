import { NocoDBService, type ListResponse } from './nocodbService'
import type { TreeInfo } from '@/models/treeInfo'
import type { Picture } from '@/models/picture'
import { nocodbTables } from '@/config/nocodb'
import { MiddlewareClient } from './middlewareClient'
import { MiddlewareService } from './middlewareService'

/**
 * Service für den Zugriff auf die TREE_INFO Tabelle
 */
export class TreeInfoService {
  readonly nocoDBService: NocoDBService
  readonly middlewareClient: MiddlewareClient
  readonly middlewareService: MiddlewareService
  private readonly tableName = 'treeInfo'

  constructor(nocoDBService?: NocoDBService, middlewareClient?: MiddlewareClient) {
    this.nocoDBService = nocoDBService || new NocoDBService()
    this.middlewareClient = middlewareClient || new MiddlewareClient()
    this.middlewareService = new MiddlewareService(this.middlewareClient)
    this.nocoDBService.registerTable(this.tableName, nocodbTables.treeInfo)
  }

  /**
   * Ruft alle Baumeinträge ab
   * @param limit Maximale Anzahl der abzurufenden Einträge
   * @param offset Anzahl der zu überspringenden Einträge (für Paginierung)
   * @returns Liste von Baumeinträgen
   */
  async getAllTrees(limit?: number, offset?: number): Promise<ListResponse<TreeInfo>> {
    return this.middlewareService.getList<TreeInfo>('tree-info', limit, offset)
  }

  /**
   * Ruft einen Baumeintrag anhand seiner ID ab
   * @param id ID des Baumeintrags
   * @returns Der angeforderte Baumeintrag
   */
  async getTreeById(id: string | number) {
    return this.middlewareService.getRecord<TreeInfo>('tree-info', id)
  }

  /**
   * Erstellt einen neuen Baumeintrag
   * @param treeInfo Daten für den neuen Baumeintrag
   * @returns Der erstellte Baumeintrag mit ID
   */
  async createTree(treeInfo: TreeInfo) {
    const [createdTree] = await this.nocoDBService.createRecords<TreeInfo, TreeInfo>(
      this.tableName,
      treeInfo,
    )
    return createdTree
  }

  /**
   * Aktualisiert einen bestehenden Baumeintrag
   * @param treeInfo Daten für die Aktualisierung (muss ID enthalten)
   * @returns Der aktualisierte Baumeintrag
   */
  async updateTree(treeInfo: TreeInfo) {
    if (!treeInfo.id) {
      throw new Error('ID ist erforderlich für die Aktualisierung')
    }

    const [updatedTree] = await this.nocoDBService.updateRecords<TreeInfo, TreeInfo>(
      this.tableName,
      treeInfo,
    )
    return updatedTree
  }

  /**
   * Löscht einen Baumeintrag anhand seiner ID
   * @param id ID des zu löschenden Baumeintrags
   * @returns true bei Erfolg
   */
  async deleteTree(id: string | number) {
    await this.nocoDBService.deleteRecords(this.tableName, id)
    return true
  }

  /**
   * Zählt die Anzahl der Baumeinträge
   * @returns Die Anzahl der Baumeinträge
   */
  async countTrees() {
    const response = await this.middlewareService.getList<TreeInfo>('tree-info', 1)
    return response.pageInfo.totalRows
  }

  /**
   * Ruft die Bilder für einen bestimmten Baum ab
   * @param treeId ID des Baums
   * @returns Liste von Bildern für den angegebenen Baum
   */
  async getTreePictures(treeId: string | number): Promise<Picture[]> {
    try {
      const tree = await this.getTreeById(treeId)
      return tree.picture ?? []
    } catch (error) {
      console.error(`Fehler beim Abrufen der Bilder für Baum ${treeId}:`, error)
      return []
    }
  }
}

export default TreeInfoService
