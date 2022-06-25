export type SolaceRiskBalance = {
    network: string
    appId: string
    balanceUSD: number
}

export type SolaceRiskScore = {
    address: string
    address_rp: number
    current_rate: number
    timestamp: string
    metadata: Metadata
    protocols: SolaceRiskProtocol[]
}

export type Metadata = {
    seriesName: string
    version: string
    dateCreated: string
    provenance: string
}

export type SolaceRiskProtocol = {
    appId: string
    balanceUSD: number
    category: string
    network: string
    riskLoad: number
    rol: number
    rrol: number
    tier: number
    ['rp-usd']: number
    ['risk-adj']: number
}

export type SolaceRiskSeries = {
    metadata: Metadata
    function: {
        name: string
        description: string
        provenance: string
    }
    data: {
        protocolMap: ProtocolMap[]
        corrValue: CorrelationValue[]
        correlCat: CorrelationCategory[]
        rateCard: RateCard[]
    }
}

export type ProtocolMap = {
    appId: string
    category: string
    tier: number
}

export type CorrelationValue = {
    category: string,
    correlation: number
}

export type CorrelationCategory = {
    category: string
    lending: number
    exchange: number
    ['liquidity-pool']: number
    unknown: number
    ['yield-aggregator']: number
    ['asset-management']: number,
    other: number
}

export type RateCard = {
    tier: number
    rol: number
    rrol: number
    riskLoad: number
}