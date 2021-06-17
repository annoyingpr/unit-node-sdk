import { CreateDebitCardRequest, Card, PatchCardRequest } from "../types/cards";
import { UnitResponse, UnitError, Include } from "../types/core";
import { Customer } from "../types/customer";
import { Account } from "../types/account";
import { BaseResource } from "./baseResource";

export class Cards extends BaseResource {

    constructor(token: string, basePath: string) {
        super(token, basePath + '/cards');
    }

    public async createDebitCard(request: CreateDebitCardRequest): Promise<UnitResponse<Card> | UnitError> {
        return await this.httpPost<UnitResponse<Card>>('', { data: request })
    }

    public async reportStolen(id: number): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}/report-stolen`
        return await this.httpPost<UnitResponse<Card>>(path)
    }

    public async reportLost(id: number): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}/report-lost`
        return await this.httpPost<UnitResponse<Card>>(path)
    }

    public async closeCard(id: number): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}/close`
        return await this.httpPost<UnitResponse<Card>>(path)
    }

    public async freeze(id: number): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}/freeze`
        return await this.httpPost<UnitResponse<Card>>(path)
    }

    public async unfreeze(id: number): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}/unfreeze`
        return await this.httpPost<UnitResponse<Card>>(path)
    }

    public async replace(request: PatchCardRequest): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${request.id}`
        const data = {
            type: request.type,
            attributes: {
                shippingAddress: request.shippingAddress
            }
        }
        
        return await this.httpPost<UnitResponse<Card>>(path, { data })
    }

    /**
     * @param id 
     * @param include - Optional. A comma-separated list of related resources to include in the response.
     * Related resources include: customer, account. See [Getting Related Resources](https://developers.unit.co/#intro-getting-related-resources).
     */
    public async get(id: number, include: string = ''): Promise<UnitResponse<Card> | UnitError> {
        const path = `/${id}?include=${include}`

        return await this.httpGet<UnitResponse<Card> & Include<Account[] | Customer[]>>(path)
    }

    public async list(params?: CardListParams): Promise<UnitResponse<Card> & Include<Account[] | Customer[]> | UnitError> {
        var parameters = {
            'page[limit]': (params?.limit ? params?.limit : 100),
            'page[offset]': (params?.offset ? params?.offset : 0),
            ...(params?.accountId && { 'filter[accountId]': params?.accountId }),
            ...(params?.customerId && { 'filter[customerId]': params?.customerId }),
            ...(params?.include && { 'include': params?.include })
        }

        return this.httpGet<UnitResponse<Card> & Include<Account[] | Customer[]>>('', { params: parameters })
    }
}

interface CardListParams {
    /**
     * Maximum number of resources that will be returned. Maximum is 1000 resources. See Pagination.
     * default: 100
     */
    limit?: number,

    /**
     * Number of resources to skip. See Pagination.
     * default: 0
     */
    offset?: number,

    /**
     * Optional. Filters the results by the specified account id.
     * default: empty
     */
    accountId?: string,

    /**
     * Optional. Filters the results by the specified customer id.
     * default: empty
     */
    customerId?: string,

    /**
     * Optional. A comma-separated list of related resources to include in the response. Related resources include: customer, account. See Getting Related Resources
     * default: empty
     */
    include?: string
}

