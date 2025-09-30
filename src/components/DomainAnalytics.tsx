import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  ChartBar, 
  TrendUp, 
  TrendDown, 
  Eye, 
  Users, 
  Clock, 
  Globe, 
  DeviceMobile, 
  Monitor, 
  DeviceTablet,
  MapPin,
  Calendar,
  Download,
  Share,
  Lightning,
  ArrowRight,
  Pulse,
  Target,
  CaretUp,
  CaretDown,
  Database,
  Timer,
  Warning,
  CheckCircle,
  Gauge,
  Plus
} from "@phosphor-icons/react"
import { useKV } from '@github/spark/hooks'
import { useState, useMemo, useEffect } from 'react'

interface AnalyticsData {
  domain: string
  totalVisitors: number
  pageViews: number
  sessions: number
  bounceRate: number
  avgSessionDuration: string
  conversionRate: number
  topPages: Array<{
    page: string
    views: number
    uniqueVisitors: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  geographicData: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  realTimeUsers: number
  performanceMetrics: {
    loadTime: number
    coreWebVitals: {
      lcp: number // Largest Contentful Paint
      fid: number // First Input Delay
      cls: number // Cumulative Layout Shift
    }
  }
  timeSeriesData: Array<{
    date: string
    visitors: number
    pageViews: number
    sessions: number
  }>
}

// Mock analytics data generator
const generateMockAnalytics = (domain: string): AnalyticsData => {
  const baseVisitors = Math.floor(Math.random() * 10000) + 1000
  
  return {
    domain,
    totalVisitors: baseVisitors,
    pageViews: Math.floor(baseVisitors * (2.5 + Math.random())),
    sessions: Math.floor(baseVisitors * 0.8),
    bounceRate: Math.floor(Math.random() * 40) + 25, // 25-65%
    avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    conversionRate: parseFloat((Math.random() * 5 + 1).toFixed(1)), // 1-6%
    topPages: [
      { page: '/', views: Math.floor(baseVisitors * 0.6), uniqueVisitors: Math.floor(baseVisitors * 0.4) },
      { page: '/about', views: Math.floor(baseVisitors * 0.2), uniqueVisitors: Math.floor(baseVisitors * 0.15) },
      { page: '/contact', views: Math.floor(baseVisitors * 0.1), uniqueVisitors: Math.floor(baseVisitors * 0.08) },
      { page: '/services', views: Math.floor(baseVisitors * 0.15), uniqueVisitors: Math.floor(baseVisitors * 0.12) },
    ],
    trafficSources: [
      { source: 'Direct', visitors: Math.floor(baseVisitors * 0.4), percentage: 40 },
      { source: 'Google Search', visitors: Math.floor(baseVisitors * 0.35), percentage: 35 },
      { source: 'Social Media', visitors: Math.floor(baseVisitors * 0.15), percentage: 15 },
      { source: 'Referral', visitors: Math.floor(baseVisitors * 0.1), percentage: 10 },
    ],
    deviceBreakdown: {
      desktop: Math.floor(Math.random() * 30) + 45, // 45-75%
      mobile: Math.floor(Math.random() * 30) + 20, // 20-50%
      tablet: Math.floor(Math.random() * 15) + 5,  // 5-20%
    },
    geographicData: [
      { country: 'Brasil', visitors: Math.floor(baseVisitors * 0.65), percentage: 65 },
      { country: 'Estados Unidos', visitors: Math.floor(baseVisitors * 0.15), percentage: 15 },
      { country: 'Portugal', visitors: Math.floor(baseVisitors * 0.08), percentage: 8 },
      { country: 'Argentina', visitors: Math.floor(baseVisitors * 0.06), percentage: 6 },
      { country: 'Outros', visitors: Math.floor(baseVisitors * 0.06), percentage: 6 },
    ],
    realTimeUsers: Math.floor(Math.random() * 50) + 5,
    performanceMetrics: {
      loadTime: parseFloat((Math.random() * 2 + 0.5).toFixed(2)), // 0.5-2.5s
      coreWebVitals: {
        lcp: parseFloat((Math.random() * 1.5 + 1).toFixed(2)), // 1-2.5s
        fid: Math.floor(Math.random() * 80) + 20, // 20-100ms
        cls: parseFloat((Math.random() * 0.15).toFixed(3)), // 0-0.15
      }
    },
    timeSeriesData: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dailyVisitors = Math.floor(baseVisitors * (0.1 + Math.random() * 0.05))
      return {
        date: date.toISOString().split('T')[0],
        visitors: dailyVisitors,
        pageViews: Math.floor(dailyVisitors * 2.3),
        sessions: Math.floor(dailyVisitors * 0.85),
      }
    })
  }
}

interface Domain {
  id: string
  domain: string
  status: 'active' | 'pending' | 'error'
  project: string
  ssl: boolean
  createdAt: string
}

export default function DomainAnalytics() {
  const [domains] = useKV<Domain[]>('pagecloud-domains', [])
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for domains if none exist
  const mockDomains: Domain[] = (domains || []).length === 0 ? [
    {
      id: 'dom_1',
      domain: 'meusite.com',
      status: 'active',
      project: 'Landing Page Moderna',
      ssl: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'dom_2', 
      domain: 'portfolio.design',
      status: 'active',
      project: 'Portfolio Criativo',
      ssl: true,
      createdAt: '2024-01-20'
    },
    {
      id: 'dom_3',
      domain: 'blog.exemplo.com',
      status: 'active', 
      project: 'Blog Minimalista',
      ssl: true,
      createdAt: '2024-01-25'
    }
  ] : (domains || [])

  useEffect(() => {
    if (selectedDomain && !isLoading) {
      setIsLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        setAnalyticsData(generateMockAnalytics(selectedDomain))
        setIsLoading(false)
      }, 1000)
    }
  }, [selectedDomain, timeRange])

  // Set initial domain if none selected
  useEffect(() => {
    if (!selectedDomain && mockDomains.length > 0) {
      setSelectedDomain(mockDomains[0].domain)
    }
  }, [mockDomains, selectedDomain])

  const getVitalsStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    }
    
    const threshold = thresholds[metric as keyof typeof thresholds]
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num)
  }

  const getTrendIcon = (isPositive: boolean) => {
    return isPositive ? <CaretUp className="w-4 h-4 text-green-600" /> : <CaretDown className="w-4 h-4 text-red-600" />
  }

  if (!mockDomains.length) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <ChartBar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum domínio configurado</h3>
          <p className="text-muted-foreground mb-6">Configure um domínio personalizado para ver as analytics.</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Domínio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics de Domínios</h1>
          <p className="text-muted-foreground">Insights detalhados de tráfego e performance dos seus sites</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedDomain} onValueChange={setSelectedDomain}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar domínio" />
            </SelectTrigger>
            <SelectContent>
              {mockDomains.map(domain => (
                <SelectItem key={domain.id} value={domain.domain}>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {domain.domain}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : analyticsData && (
        <>
          {/* Real-time Status */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">Ao Vivo</span>
                  </div>
                  <span className="text-2xl font-bold text-green-800">
                    {analyticsData.realTimeUsers}
                  </span>
                  <span className="text-green-600">usuários online agora</span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Pulse className="w-3 h-3 mr-1" />
                  Atualização em tempo real
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Visitantes Únicos</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{formatNumber(analyticsData.totalVisitors)}</div>
                  {getTrendIcon(true)}
                  <span className="text-sm text-green-600">+12%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">vs. período anterior</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Visualizações</CardTitle>
                <ChartBar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{formatNumber(analyticsData.pageViews)}</div>
                  {getTrendIcon(true)}
                  <span className="text-sm text-green-600">+8%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">páginas visitadas</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Rejeição</CardTitle>
                <Target className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{analyticsData.bounceRate}%</div>
                  {getTrendIcon(false)}
                  <span className="text-sm text-red-600">+2%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">visitantes que saíram</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{analyticsData.avgSessionDuration}</div>
                  {getTrendIcon(true)}
                  <span className="text-sm text-green-600">+5%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">duração da sessão</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="traffic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="traffic">Tráfego</TabsTrigger>
              <TabsTrigger value="sources">Origens</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="geography">Geografia</TabsTrigger>
            </TabsList>

            <TabsContent value="traffic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visitantes nos Últimos 7 Dias</CardTitle>
                    <CardDescription>Tendência de tráfego diário</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.timeSeriesData.map((day, index) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium min-w-[80px]">
                              {new Date(day.date).toLocaleDateString('pt-BR', { 
                                weekday: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex-1">
                              <Progress 
                                value={day.visitors / Math.max(...analyticsData.timeSeriesData.map(d => d.visitors)) * 100} 
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div className="text-sm font-medium min-w-[60px] text-right">
                            {formatNumber(day.visitors)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Páginas Mais Visitadas</CardTitle>
                    <CardDescription>Performance por página</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.topPages.map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{page.page === '/' ? 'Página Inicial' : page.page}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatNumber(page.uniqueVisitors)} visitantes únicos
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatNumber(page.views)}</div>
                            <div className="text-sm text-muted-foreground">views</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Dispositivo</CardTitle>
                  <CardDescription>Como os visitantes acessam seu site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <Monitor className="w-8 h-8 text-primary mx-auto" />
                      <div className="text-2xl font-bold">{analyticsData.deviceBreakdown.desktop}%</div>
                      <div className="text-sm text-muted-foreground">Desktop</div>
                      <Progress value={analyticsData.deviceBreakdown.desktop} className="h-2" />
                    </div>
                    <div className="text-center space-y-2">
                      <DeviceMobile className="w-8 h-8 text-accent mx-auto" />
                      <div className="text-2xl font-bold">{analyticsData.deviceBreakdown.mobile}%</div>
                      <div className="text-sm text-muted-foreground">Mobile</div>
                      <Progress value={analyticsData.deviceBreakdown.mobile} className="h-2" />
                    </div>
                    <div className="text-center space-y-2">
                      <DeviceTablet className="w-8 h-8 text-secondary-foreground mx-auto" />
                      <div className="text-2xl font-bold">{analyticsData.deviceBreakdown.tablet}%</div>
                      <div className="text-sm text-muted-foreground">Tablet</div>
                      <Progress value={analyticsData.deviceBreakdown.tablet} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fontes de Tráfego</CardTitle>
                    <CardDescription>De onde vêm seus visitantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.trafficSources.map((source) => (
                        <div key={source.source} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatNumber(source.visitors)} ({source.percentage}%)
                            </span>
                          </div>
                          <Progress value={source.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Conversão</CardTitle>
                    <CardDescription>Performance de objetivos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {analyticsData.conversionRate}%
                      </div>
                      <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sessões</span>
                        <span className="font-medium">{formatNumber(analyticsData.sessions)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conversões</span>
                        <span className="font-medium">
                          {Math.floor(analyticsData.sessions * analyticsData.conversionRate / 100)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Core Web Vitals</CardTitle>
                    <CardDescription>Métricas essenciais de experiência do usuário</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* LCP */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Largest Contentful Paint (LCP)</span>
                        <Badge 
                          variant={getVitalsStatus('lcp', analyticsData.performanceMetrics.coreWebVitals.lcp) === 'good' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {analyticsData.performanceMetrics.coreWebVitals.lcp}s
                        </Badge>
                      </div>
                      <Progress 
                        value={Math.min(analyticsData.performanceMetrics.coreWebVitals.lcp / 4 * 100, 100)} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">Tempo para carregar o maior elemento</p>
                    </div>

                    {/* FID */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">First Input Delay (FID)</span>
                        <Badge 
                          variant={getVitalsStatus('fid', analyticsData.performanceMetrics.coreWebVitals.fid) === 'good' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {analyticsData.performanceMetrics.coreWebVitals.fid}ms
                        </Badge>
                      </div>
                      <Progress 
                        value={Math.min(analyticsData.performanceMetrics.coreWebVitals.fid / 300 * 100, 100)} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">Tempo para primeira interação</p>
                    </div>

                    {/* CLS */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Cumulative Layout Shift (CLS)</span>
                        <Badge 
                          variant={getVitalsStatus('cls', analyticsData.performanceMetrics.coreWebVitals.cls) === 'good' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {analyticsData.performanceMetrics.coreWebVitals.cls}
                        </Badge>
                      </div>
                      <Progress 
                        value={Math.min(analyticsData.performanceMetrics.coreWebVitals.cls / 0.25 * 100, 100)} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground">Estabilidade visual</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Métricas de Performance</CardTitle>
                    <CardDescription>Tempo de carregamento e otimização</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <Lightning className="w-8 h-8 text-yellow-500 mx-auto" />
                        <div className="text-2xl font-bold">{analyticsData.performanceMetrics.loadTime}s</div>
                        <div className="text-sm text-muted-foreground">Tempo Médio de Carregamento</div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">SSL Ativo</span>
                          </div>
                          <Badge variant="outline" className="text-green-700 border-green-300">Seguro</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">CDN Habilitado</span>
                          </div>
                          <Badge variant="outline" className="text-blue-700 border-blue-300">Otimizado</Badge>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200">
                          <div className="flex items-center gap-2">
                            <Warning className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Compressão</span>
                          </div>
                          <Badge variant="outline" className="text-orange-700 border-orange-300">Melhorar</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="geography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Geográfica</CardTitle>
                  <CardDescription>Visitantes por país/região</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.geographicData.map((geo) => (
                      <div key={geo.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{geo.country}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32">
                            <Progress value={geo.percentage} className="h-2" />
                          </div>
                          <div className="text-sm text-muted-foreground min-w-[80px] text-right">
                            {formatNumber(geo.visitors)} ({geo.percentage}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}