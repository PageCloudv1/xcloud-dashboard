import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Globe, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Warning, 
  Copy,
  ArrowSquareOut,
  Gear,
  Trash,
  Shield,
  Link,
  ArrowRight,
  Cpu,
  TrendUp,
  Eye,
  Lightning
} from "@phosphor-icons/react"
import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

interface CustomDomain {
  id: string
  domain: string
  projectId: string
  projectName: string
  status: 'pending' | 'active' | 'failed' | 'verifying'
  sslStatus: 'pending' | 'active' | 'failed'
  dnsRecords: {
    type: 'CNAME' | 'A'
    name: string
    value: string
    status: 'pending' | 'active' | 'failed'
  }[]
  createdAt: string
  lastChecked: string
  analytics: {
    visits: number
    uptime: number
    speed: number
  }
}

interface Project {
  id: string
  name: string
  status: 'draft' | 'deploying' | 'live' | 'error'
  url?: string
}

interface DomainManagementProps {
  projects: Project[]
}

export default function DomainManagement({ projects }: DomainManagementProps) {
  const [domains, setDomains] = useKV<CustomDomain[]>('pagecloud-domains', [])
  const [isAddingDomain, setIsAddingDomain] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Sample domain data for demonstration
  const sampleDomains: CustomDomain[] = [
    {
      id: 'domain_1',
      domain: 'meuportfolio.com',
      projectId: 'proj_001',
      projectName: 'Portfolio Criativo',
      status: 'active',
      sslStatus: 'active',
      dnsRecords: [
        {
          type: 'CNAME',
          name: 'www',
          value: 'pagecloud-deploy.netlify.com',
          status: 'active'
        }
      ],
      createdAt: 'há 5 dias',
      lastChecked: 'há 2 minutos',
      analytics: {
        visits: 1247,
        uptime: 99.9,
        speed: 92
      }
    },
    {
      id: 'domain_2', 
      domain: 'minhaloja.online',
      projectId: 'proj_002',
      projectName: 'Loja Online',
      status: 'verifying',
      sslStatus: 'pending',
      dnsRecords: [
        {
          type: 'A',
          name: '@',
          value: '104.198.14.52',
          status: 'pending'
        }
      ],
      createdAt: 'há 2 horas',
      lastChecked: 'há 30 segundos',
      analytics: {
        visits: 0,
        uptime: 0,
        speed: 0
      }
    }
  ]

  // Use sample data if no domains exist
  const allDomains = (domains || []).length === 0 ? sampleDomains : (domains || [])

  const addCustomDomain = async () => {
    if (!newDomain || !selectedProject) {
      toast.error('Preencha o domínio e selecione um projeto')
      return
    }

    if (!newDomain.includes('.')) {
      toast.error('Digite um domínio válido (ex: meusite.com)')
      return
    }

    setIsAddingDomain(true)
    
    // Simulate domain validation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const project = projects.find(p => p.id === selectedProject)
    if (!project) {
      toast.error('Projeto não encontrado')
      setIsAddingDomain(false)
      return
    }

    const newCustomDomain: CustomDomain = {
      id: `domain_${Date.now()}`,
      domain: newDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, ''),
      projectId: selectedProject,
      projectName: project.name,
      status: 'verifying',
      sslStatus: 'pending',
      dnsRecords: [
        {
          type: 'CNAME',
          name: 'www',
          value: 'pagecloud-deploy.netlify.com',
          status: 'pending'
        }
      ],
      createdAt: 'agora',
      lastChecked: 'agora',
      analytics: {
        visits: 0,
        uptime: 0,
        speed: 0
      }
    }

    setDomains(current => [...(current || []), newCustomDomain])
    setNewDomain('')
    setSelectedProject('')
    setIsAddingDomain(false)
    
    toast.success('Domínio adicionado! Configurando DNS...')
    
    // Simulate DNS verification after 5 seconds
    setTimeout(() => {
      setDomains(current => 
        (current || []).map(d => 
          d.id === newCustomDomain.id 
            ? { 
                ...d, 
                status: 'active' as const,
                sslStatus: 'active' as const,
                dnsRecords: d.dnsRecords.map(record => ({
                  ...record,
                  status: 'active' as const
                }))
              }
            : d
        )
      )
      toast.success('Domínio configurado com sucesso!')
    }, 5000)
  }

  const verifyDomain = async (domainId: string) => {
    setIsVerifying(true)
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setDomains(current => 
      (current || []).map(d => 
        d.id === domainId 
          ? { 
              ...d, 
              status: Math.random() > 0.3 ? 'active' as const : 'failed' as const,
              lastChecked: 'agora'
            }
          : d
      )
    )
    
    setIsVerifying(false)
    toast.success('Verificação concluída!')
  }

  const deleteDomain = (domainId: string) => {
    const domain = allDomains.find(d => d.id === domainId)
    if (domain) {
      setDomains(current => (current || []).filter(d => d.id !== domainId))
      toast.success(`Domínio ${domain.domain} removido`)
    }
  }

  const copyDNSRecord = (value: string) => {
    navigator.clipboard.writeText(value)
    toast.success('Registro DNS copiado!')
  }

  const getStatusIcon = (status: CustomDomain['status']) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'verifying': return Clock
      case 'pending': return Clock
      case 'failed': return XCircle
    }
  }

  const getStatusColor = (status: CustomDomain['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'verifying': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
    }
  }

  const getStatusText = (status: CustomDomain['status']) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'verifying': return 'Verificando'
      case 'pending': return 'Pendente'
      case 'failed': return 'Erro'
    }
  }

  const liveProjects = projects.filter(p => p.status === 'live')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground flex items-center gap-3">
            <Globe className="w-7 h-7 text-primary" />
            Domínios Personalizados
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure domínios personalizados para seus projetos
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Domínio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Domínio Personalizado</DialogTitle>
              <DialogDescription>
                Conecte seu domínio a um projeto publicado
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domínio</Label>
                <Input
                  id="domain"
                  placeholder="meusite.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Digite apenas o domínio, sem http:// ou www
                </p>
              </div>

              <div className="space-y-2">
                <Label>Projeto de Destino</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto publicado" />
                  </SelectTrigger>
                  <SelectContent>
                    {liveProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {project.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {liveProjects.length === 0 && (
                  <p className="text-xs text-muted-foreground text-yellow-600">
                    Você precisa ter pelo menos um projeto publicado
                  </p>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={addCustomDomain} 
                  disabled={isAddingDomain || !newDomain || !selectedProject}
                  className="w-full"
                >
                  {isAddingDomain ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Configurando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Domínio
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Domínios Ativos</p>
                <p className="text-2xl font-bold text-foreground">
                  {allDomains.filter(d => d.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Visitas</p>
                <p className="text-2xl font-bold text-foreground">
                  {allDomains.reduce((acc, d) => acc + d.analytics.visits, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  {allDomains.length > 0 ? 
                    (allDomains.reduce((acc, d) => acc + d.analytics.uptime, 0) / allDomains.length).toFixed(1)
                    : '0'
                  }%
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domain List */}
      <div className="space-y-4">
        {allDomains.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Nenhum domínio configurado</h3>
            <p className="text-muted-foreground mb-6">
              Adicione seu primeiro domínio personalizado para dar uma identidade única aos seus projetos.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Domínio
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Adicionar Domínio Personalizado</DialogTitle>
                  <DialogDescription>
                    Conecte seu domínio a um projeto publicado
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domínio</Label>
                    <Input
                      id="domain"
                      placeholder="meusite.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Projeto de Destino</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um projeto publicado" />
                      </SelectTrigger>
                      <SelectContent>
                        {liveProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={addCustomDomain} 
                    disabled={isAddingDomain || !newDomain || !selectedProject}
                    className="w-full"
                  >
                    {isAddingDomain ? 'Configurando...' : 'Adicionar Domínio'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          allDomains.map(domain => {
            const StatusIcon = getStatusIcon(domain.status)
            
            return (
              <Card key={domain.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                          <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">{domain.domain}</h3>
                            <Badge className={`${getStatusColor(domain.status)} border-0`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {getStatusText(domain.status)}
                            </Badge>
                            {domain.sslStatus === 'active' && (
                              <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                                <Shield className="w-3 h-3 mr-1" />
                                SSL
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Link className="w-4 h-4" />
                              <span>{domain.projectName}</span>
                            </div>
                            <span>•</span>
                            <span>Criado {domain.createdAt}</span>
                            <span>•</span>
                            <span>Verificado {domain.lastChecked}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => verifyDomain(domain.id)}
                          disabled={isVerifying}
                        >
                          {isVerifying ? (
                            <Clock className="w-4 h-4 animate-spin" />
                          ) : (
                            <Gear className="w-4 h-4" />
                          )}
                        </Button>

                        {domain.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                          >
                            <ArrowSquareOut className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteDomain(domain.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Analytics */}
                    {domain.status === 'active' && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground mb-1">
                            <Eye className="w-4 h-4" />
                            Visitas
                          </div>
                          <p className="text-xl font-bold text-foreground">
                            {domain.analytics.visits.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground mb-1">
                            <Cpu className="w-4 h-4" />
                            Uptime
                          </div>
                          <p className="text-xl font-bold text-green-600">
                            {domain.analytics.uptime}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground mb-1">
                            <Lightning className="w-4 h-4" />
                            Speed
                          </div>
                          <p className="text-xl font-bold text-blue-600">
                            {domain.analytics.speed}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* DNS Records */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                        <Gear className="w-4 h-4" />
                        Configuração DNS
                      </h4>
                      <div className="space-y-2">
                        {domain.dnsRecords.map((record, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="grid grid-cols-3 gap-4 flex-1">
                              <div>
                                <p className="text-xs text-muted-foreground">Tipo</p>
                                <p className="font-mono text-sm">{record.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Nome</p>
                                <p className="font-mono text-sm">{record.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Valor</p>
                                <p className="font-mono text-sm truncate">{record.value}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(record.status)} text-xs border-0`}
                              >
                                {getStatusText(record.status)}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyDNSRecord(record.value)}
                                className="px-2"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {domain.status !== 'active' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                Configure os registros DNS
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                Adicione os registros acima no painel do seu provedor de domínio. 
                                A propagação pode levar até 48 horas.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}