import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { NotificationCenter } from "./NotificationCenter"
import DomainManagement from "./DomainManagement"
import DomainAnalytics from "./DomainAnalytics"
import { 
  Globe, 
  Code, 
  Palette, 
  Rocket, 
  Plus, 
  Gear, 
  User, 
  SignOut,
  ArrowSquareOut,
  Copy,
  Play,
  Pause,
  Monitor,
  DeviceMobile,
  DeviceTablet,
  ChartBar,
  Eye,
  Clock,
  Database,
  Lightning,
  Bell,
  Question,
  GitBranch,
  BookOpen,
  Users,
  Cpu,
  TrendUp,
  MagnifyingGlass,
  SortAscending,
  FunnelSimple,
  Trash,
  Star,
  Share,
  Download,
  Upload,
  CloudCheck,
  Warning,
  CheckCircle,
  XCircle,
  FloppyDisk,
  FolderOpen,
  Image as ImageIcon,
  Link,
  PaintBrush,
  TextT,
  Square,
  GridNine,
  ListBullets,
  CaretDown,
  Heart,
  ThumbsUp
} from "@phosphor-icons/react"
import { useKV } from '@github/spark/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  template: string
  status: 'draft' | 'deploying' | 'live' | 'error'
  url?: string
  lastModified: string
  preview: string
  views: number
  favorite: boolean
  collaborators: string[]
  tags: string[]
}

interface User {
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
}

const mockUser: User = {
  name: "Ana Silva",
  email: "ana@exemplo.com",
  avatar: undefined,
  plan: "pro"
}

const templateGallery = [
  {
    id: 'landing-modern',
    name: 'Landing Page Moderna',
    category: 'Landing',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    description: 'Design limpo e responsivo para produtos digitais'
  },
  {
    id: 'portfolio-creative',
    name: 'Portfolio Criativo',
    category: 'Portfolio',
    preview: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop',
    description: 'Showcase visual para designers e artistas'
  },
  {
    id: 'blog-minimal',
    name: 'Blog Minimalista',
    category: 'Blog',
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=400&h=250&fit=crop',
    description: 'Foco no conteúdo com tipografia elegante'
  },
  {
    id: 'ecommerce-store',
    name: 'Loja Online',
    category: 'E-commerce',
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop',
    description: 'Experiência de compra otimizada'
  }
]

export default function PageCloudApp() {
  const [projects, setProjects] = useKV<Project[]>('pagecloud-projects', [])
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'domains' | 'analytics'>('dashboard')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual')
  const [isDeploying, setIsDeploying] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'draft' | 'live' | 'deploying'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'views'>('modified')
  const [showFavorites, setShowFavorites] = useState(false)

  // Ensure all projects have required properties with defaults
  const normalizedProjects = (projects || []).map(project => ({
    ...project,
    tags: project.tags || [],
    collaborators: project.collaborators || [mockUser.email],
    views: project.views || 0,
    favorite: project.favorite || false
  }))

  const createProject = (template: any) => {
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: template.name,
      template: template.id,
      status: 'draft',
      lastModified: new Date().toLocaleString('pt-BR'),
      preview: template.preview,
      views: 0,
      favorite: false,
      collaborators: [mockUser.email],
      tags: [template.category.toLowerCase()]
    }
    
    setProjects((current = []) => [...current, newProject])
    setSelectedProject(newProject)
    setCurrentView('editor')
    toast.success(`Projeto "${template.name}" criado com sucesso!`)
  }

  const deployProject = async (project: Project) => {
    setIsDeploying(true)
    
    // Simulate deploy process
    setProjects((current = []) => 
      current.map(p => 
        p.id === project.id 
          ? { ...p, status: 'deploying' as const }
          : p
      )
    )
    
    // Simulate build time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const deployUrl = `https://${project.name.toLowerCase().replace(/\s+/g, '-')}-${project.id.slice(-6)}.pagecloud.app`
    
    setProjects((current = []) => 
      current.map(p => 
        p.id === project.id 
          ? { ...p, status: 'live' as const, url: deployUrl }
          : p
      )
    )
    
    setIsDeploying(false)
    toast.success(`Deploy realizado! Site disponível em ${deployUrl}`)
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'deploying': return 'bg-blue-100 text-blue-800'
      case 'live': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
    }
  }

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'draft': return 'Rascunho'
      case 'deploying': return 'Publicando...'
      case 'live': return 'Online'
      case 'error': return 'Erro'
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'draft': return Warning
      case 'deploying': return CloudCheck
      case 'live': return CheckCircle
      case 'error': return XCircle
    }
  }

  const toggleFavorite = (projectId: string) => {
    setProjects((current = []) =>
      current.map(p =>
        p.id === projectId ? { ...p, favorite: !p.favorite } : p
      )
    )
    const project = normalizedProjects.find(p => p.id === projectId)
    toast.success(project?.favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  const deleteProject = (projectId: string) => {
    const project = normalizedProjects.find(p => p.id === projectId)
    if (project) {
      setProjects((current = []) => current.filter(p => p.id !== projectId))
      toast.success(`Projeto "${project.name}" excluído`)
    }
  }

  const shareProject = (project: Project) => {
    if (project.url) {
      navigator.clipboard.writeText(project.url)
      toast.success('Link copiado para a área de transferência!')
    } else {
      toast.error('Publique o projeto primeiro para compartilhar')
    }
  }

  const duplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Cópia)`,
      status: 'draft',
      lastModified: new Date().toLocaleString('pt-BR'),
      url: undefined,
      views: 0
    }
    setProjects((current = []) => [...current, duplicated])
    toast.success('Projeto duplicado com sucesso!')
  }

  const filteredProjects = normalizedProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter
    const matchesFavorites = !showFavorites || project.favorite
    return matchesSearch && matchesFilter && matchesFavorites
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'views':
        return b.views - a.views
      case 'modified':
      default:
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    }
  })

  if (currentView === 'editor' && selectedProject) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Editor Header */}
        <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Voltar ao Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl">{selectedProject.name}</h1>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={() => toggleFavorite(selectedProject.id)}
              >
                <Star className={`w-4 h-4 ${selectedProject.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </Button>
            </div>
            <Badge variant="outline" className={getStatusColor(selectedProject.status)}>
              {getStatusText(selectedProject.status)}
            </Badge>
            {selectedProject.views > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{selectedProject.views.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-1 bg-muted/50">
              <Button 
                variant={previewDevice === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button 
                variant={previewDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
              >
                <DeviceTablet className="w-4 h-4" />
              </Button>
              <Button 
                variant={previewDevice === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
              >
                <DeviceMobile className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="outline" size="sm">
              <FloppyDisk className="w-4 h-4 mr-2" />
              Salvar
            </Button>

            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            
            <Button 
              onClick={() => deployProject(selectedProject)}
              disabled={isDeploying}
              className="bg-accent hover:bg-accent/90"
            >
              <Rocket className={`w-4 h-4 mr-2 ${isDeploying ? 'animate-deploy-pulse' : ''}`} />
              {isDeploying ? 'Publicando...' : 'Publicar'}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Gear className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => shareProject(selectedProject)}>
                  <Share className="w-4 h-4 mr-2" />
                  Compartilhar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => duplicateProject(selectedProject)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar projeto
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar código
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                  <Gear className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Modes */}
          <div className="w-16 border-r bg-card flex flex-col items-center py-4 gap-2">
            <Button
              variant={editorMode === 'visual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('visual')}
              className="w-12 h-12"
            >
              <Palette className="w-5 h-5" />
            </Button>
            <Button
              variant={editorMode === 'code' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('code')}
              className="w-12 h-12"
            >
              <Code className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Editor Area */}
          <div className="flex-1 flex">
            {editorMode === 'visual' ? (
              /* Visual Editor */
              <div className="flex-1 flex">
                {/* Component Palette */}
                <div className="w-64 border-r bg-card p-4 overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="font-semibold text-sm text-foreground mb-3">Componentes</h3>
                    <Input 
                      placeholder="Buscar componentes..."
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {/* Basic Elements */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Elementos Básicos
                      </h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Texto', icon: TextT, desc: 'Parágrafo ou título' },
                          { name: 'Imagem', icon: ImageIcon, desc: 'Foto ou ilustração' },
                          { name: 'Botão', icon: Square, desc: 'Ação clicável' },
                          { name: 'Link', icon: Link, desc: 'Link para outra página' }
                        ].map(component => (
                          <div 
                            key={component.name}
                            className="p-3 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <component.icon className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{component.name}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{component.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Layout */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Layout
                      </h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Container', icon: Square, desc: 'Área de conteúdo' },
                          { name: 'Grid', icon: GridNine, desc: 'Layout em grades' },
                          { name: 'Seção', icon: ListBullets, desc: 'Divisão de página' }
                        ].map(component => (
                          <div 
                            key={component.name}
                            className="p-3 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <component.icon className="w-4 h-4 text-accent" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{component.name}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{component.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive */}
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Interativo
                      </h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Formulário', icon: ListBullets, desc: 'Campos de entrada' },
                          { name: 'Menu', icon: ListBullets, desc: 'Navegação' },
                          { name: 'Modal', icon: Square, desc: 'Janela sobreposta' }
                        ].map(component => (
                          <div 
                            key={component.name}
                            className="p-3 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <component.icon className="w-4 h-4 text-purple-600" />
                              <div className="flex-1">
                                <span className="text-sm font-medium">{component.name}</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{component.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-muted/20 p-8 overflow-auto">
                  <div 
                    className={`
                      mx-auto bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300
                      ${previewDevice === 'desktop' ? 'max-w-6xl' : ''}
                      ${previewDevice === 'tablet' ? 'max-w-2xl' : ''}
                      ${previewDevice === 'mobile' ? 'max-w-sm' : ''}
                    `}
                    style={{ minHeight: '80vh' }}
                  >
                    {/* Mock Website Content */}
                    <div className="relative">
                      <img 
                        src={selectedProject.preview} 
                        alt="Project Preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-white text-center">
                          <h1 className="font-display text-4xl mb-4">Seu Projeto Aqui</h1>
                          <p className="text-lg opacity-90">Editor visual em ação</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h2 className="font-display text-2xl mb-4">Seção de Conteúdo</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Este é seu espaço criativo. Arraste componentes da paleta lateral 
                        para construir sua página de forma visual e intuitiva.
                      </p>
                      <div className="flex gap-4">
                        <Button size="lg" className="bg-primary">
                          Botão Principal
                        </Button>
                        <Button size="lg" variant="outline">
                          Botão Secundário
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Code Editor */
              <div className="flex-1 bg-gray-900 text-green-400 font-code p-6 relative overflow-auto">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="animate-code-sync flex items-center gap-2 bg-green-900/30 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs">Sincronizando...</span>
                  </div>
                </div>
                
                <pre className="text-sm leading-relaxed">
{`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${selectedProject.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .hero {
            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)),
                        url('${selectedProject.preview}');
            background-size: cover;
            background-position: center;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background-color 0.2s;
        }
        
        .btn:hover {
            background: #1d4ed8;
        }
    </style>
</head>
<body>
    <section class="hero">
        <div>
            <h1>Seu Projeto Aqui</h1>
            <p>Editor visual em ação</p>
        </div>
    </section>
    
    <div class="container">
        <h2>Seção de Conteúdo</h2>
        <p>Este é seu espaço criativo. Edite o código diretamente 
           ou use o editor visual para construir sua página.</p>
        <a href="#" class="btn">Botão Principal</a>
    </div>
</body>
</html>`}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Domain Management View
  if (currentView === 'domains') {
    return (
      <div className="min-h-screen bg-background">
        {/* Enhanced Header for Domains */}
        <header className="menu-container border-b shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-5">
            {/* Main Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative logo-enhanced">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl animate-gradient-shift animate-float">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h1 className="font-display text-3xl gradient-text tracking-tight">PageCloud</h1>
                  <p className="text-base text-muted-foreground font-medium">Plataforma de Desenvolvimento Web</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="notification-badge">
                  <NotificationCenter />
                </div>

                {/* Help */}
                <Button variant="ghost" size="sm" className="w-12 h-12 rounded-2xl hover-glow transition-all duration-300 hover:scale-110">
                  <Question className="w-6 h-6" />
                </Button>

                {/* User Section */}
                <div className="flex items-center gap-4 pl-6 border-l-2 border-gradient-to-b from-primary/20 to-accent/20">
                  <div className="gradient-border rounded-2xl">
                    <Badge variant="outline" className="bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border-0 font-bold px-4 py-2 text-sm">
                      {mockUser.plan.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-4 h-auto p-3 hover-glow rounded-2xl transition-all duration-300">
                        <Avatar className="user-avatar w-12 h-12 ring-3 ring-primary/30 ring-offset-3">
                          <AvatarImage src={mockUser.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-base">
                            {mockUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="hidden sm:block text-left">
                          <p className="text-base font-bold text-foreground">{mockUser.name}</p>
                          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 menu-dropdown">
                      <DropdownMenuItem className="menu-dropdown-item py-3">
                        <User className="w-5 h-5 mr-3" />
                        <span className="text-base">Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="menu-dropdown-item py-3">
                        <Gear className="w-5 h-5 mr-3" />
                        <span className="text-base">Configurações</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem className="menu-dropdown-item text-destructive py-3">
                        <SignOut className="w-5 h-5 mr-3" />
                        <span className="text-base">Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-glass p-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="menu-item"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <ChartBar className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Dashboard</span>
                </Button>
                <Button variant="ghost" className="menu-item active">
                  <Globe className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Domínios</span>
                </Button>
                <Button variant="ghost" className="menu-item">
                  <Users className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Equipe</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="menu-item"
                  onClick={() => setCurrentView('analytics')}
                >
                  <Database className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Analytics</span>
                </Button>
                <Button variant="ghost" className="menu-item">
                  <Gear className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Configurações</span>
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <DomainManagement projects={normalizedProjects} />
        </main>

        {/* Footer */}
        <footer className="bg-card border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground">PageCloud</h3>
                    <p className="text-xs text-muted-foreground">Desenvolvimento Web Simplificado</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie, edite e publique sites profissionais de forma visual e intuitiva.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">v2.1.4</Badge>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Online
                  </Badge>
                </div>
              </div>

              {/* Documentation */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentação
                </h4>
                <nav className="space-y-3">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Primeiros Passos
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Guia do Editor
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Templates & Temas
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Deploy & Hospedagem
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    API Reference
                  </a>
                </nav>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recursos
                </h4>
                <nav className="space-y-3">
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Centro de Ajuda
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Comunidade
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Blog & Tutoriais
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Status da Plataforma
                  </a>
                  <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Changelog
                  </a>
                </nav>
              </div>

              {/* Development */}
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Desenvolvimento
                </h4>
                <nav className="space-y-3">
                  <a 
                    href="https://github.com/pagecloud/platform" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <GitBranch className="w-3 h-3" />
                    Repositório GitHub
                  </a>
                  <a 
                    href="https://github.com/pagecloud/platform/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Reportar Bugs
                  </a>
                  <a 
                    href="https://github.com/pagecloud/platform/discussions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Discussões
                  </a>
                  <a 
                    href="https://github.com/pagecloud/platform/wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Wiki do Projeto
                  </a>
                  <a 
                    href="https://github.com/pagecloud/platform/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Releases
                  </a>
                </nav>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>© 2024 PageCloud. Todos os direitos reservados.</span>
                <a href="#" className="hover:text-primary transition-colors">
                  Termos de Uso
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacidade
                </a>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Todos os sistemas operacionais</span>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Question className="w-3 h-3 mr-2" />
                  Suporte
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Analytics View
  if (currentView === 'analytics') {
    return (
      <div className="min-h-screen bg-background">
        {/* Enhanced Header for Analytics */}
        <header className="menu-container border-b shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-5">
            {/* Main Header Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative logo-enhanced">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl animate-gradient-shift animate-float">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h1 className="font-display text-3xl gradient-text tracking-tight">PageCloud</h1>
                  <p className="text-base text-muted-foreground font-medium">Plataforma de Desenvolvimento Web</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="notification-badge">
                  <NotificationCenter />
                </div>

                {/* Help */}
                <Button variant="ghost" size="sm" className="w-12 h-12 rounded-2xl hover-glow transition-all duration-300 hover:scale-110">
                  <Question className="w-6 h-6" />
                </Button>

                {/* User Section */}
                <div className="flex items-center gap-4 pl-6 border-l-2 border-gradient-to-b from-primary/20 to-accent/20">
                  <div className="gradient-border rounded-2xl">
                    <Badge variant="outline" className="bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border-0 font-bold px-4 py-2 text-sm">
                      {mockUser.plan.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-4 h-auto p-3 hover-glow rounded-2xl transition-all duration-300">
                        <Avatar className="user-avatar w-12 h-12 ring-3 ring-primary/30 ring-offset-3">
                          <AvatarImage src={mockUser.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-base">
                            {mockUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="hidden sm:block text-left">
                          <p className="text-base font-bold text-foreground">{mockUser.name}</p>
                          <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 menu-dropdown">
                      <DropdownMenuItem className="menu-dropdown-item py-3">
                        <User className="w-5 h-5 mr-3" />
                        <span className="text-base">Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="menu-dropdown-item py-3">
                        <Gear className="w-5 h-5 mr-3" />
                        <span className="text-base">Configurações</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-2" />
                      <DropdownMenuItem className="menu-dropdown-item text-destructive py-3">
                        <SignOut className="w-5 h-5 mr-3" />
                        <span className="text-base">Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-glass p-3 shadow-2xl">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  className="menu-item"
                  onClick={() => setCurrentView('dashboard')}
                >
                  <ChartBar className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Dashboard</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="menu-item"
                  onClick={() => setCurrentView('domains')}
                >
                  <Globe className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Domínios</span>
                </Button>
                <Button variant="ghost" className="menu-item active">
                  <Database className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Analytics</span>
                </Button>
                <Button variant="ghost" className="menu-item">
                  <Users className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Equipe</span>
                </Button>
                <Button variant="ghost" className="menu-item">
                  <Gear className="menu-icon w-5 h-5 mr-3" />
                  <span className="font-semibold text-base">Configurações</span>
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <DomainAnalytics />
        </main>

        {/* Footer */}
        <footer className="bg-card border-t mt-12">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-foreground">PageCloud</h3>
                    <p className="text-xs text-muted-foreground">Desenvolvimento Web Simplificado</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Crie, edite e publique sites profissionais de forma visual e intuitiva.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">v1.0.0</Badge>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Stable
                  </Badge>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4">Recursos</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Componentes</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Integrações</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                </ul>
              </div>

              {/* Documentation */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4">Documentação</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="https://docs.pagecloud.com" target="_blank" rel="noopener noreferrer" 
                       className="hover:text-foreground transition-colors flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Guia de Início
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/pagecloud/docs" target="_blank" rel="noopener noreferrer"
                       className="hover:text-foreground transition-colors flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      GitHub
                    </a>
                  </li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-4">Suporte</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Comunidade</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Status do Sistema</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                </ul>
              </div>
            </div>

            <Separator className="my-8" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <p>&copy; 2024 PageCloud. Todos os direitos reservados.</p>
                <div className="flex items-center gap-3">
                  <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
                  <a href="#" className="hover:text-foreground transition-colors">Termos</a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Feito com</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>no Brasil</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Unique Header */}
      <header className="menu-container border-b shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          {/* Main Header Row with Enhanced Styling */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative logo-enhanced">
                <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl flex items-center justify-center shadow-2xl animate-gradient-shift animate-float">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white animate-pulse shadow-lg"></div>
              </div>
              <div>
                <h1 className="font-display text-3xl gradient-text tracking-tight">PageCloud</h1>
                <p className="text-base text-muted-foreground font-medium">Plataforma de Desenvolvimento Web</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Enhanced Search */}
              <div className="hidden md:block relative group">
                <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-all duration-300" />
                <Input
                  placeholder="Busca rápida..."
                  className="search-enhanced pl-12 w-72 h-12 text-base rounded-2xl focus:outline-none"
                />
              </div>

              {/* Enhanced Notifications */}
              <div className="notification-badge">
                <NotificationCenter />
              </div>

              {/* Enhanced Help Button */}
              <Button variant="ghost" size="sm" className="w-12 h-12 rounded-2xl hover-glow transition-all duration-300 hover:scale-110">
                <Question className="w-6 h-6" />
              </Button>

              {/* Enhanced User Section */}
              <div className="flex items-center gap-4 pl-6 border-l-2 border-gradient-to-b from-primary/20 to-accent/20">
                <div className="gradient-border rounded-2xl">
                  <Badge variant="outline" className="bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border-0 font-bold px-4 py-2 text-sm">
                    {mockUser.plan.toUpperCase()}
                  </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-4 h-auto p-3 hover-glow rounded-2xl transition-all duration-300">
                      <Avatar className="user-avatar w-12 h-12 ring-3 ring-primary/30 ring-offset-3">
                        <AvatarImage src={mockUser.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-base">
                          {mockUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="hidden sm:block text-left">
                        <p className="text-base font-bold text-foreground">{mockUser.name}</p>
                        <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 menu-dropdown">
                    <DropdownMenuItem className="menu-dropdown-item py-3">
                      <User className="w-5 h-5 mr-3" />
                      <span className="text-base">Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="menu-dropdown-item py-3">
                      <Gear className="w-5 h-5 mr-3" />
                      <span className="text-base">Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="menu-dropdown-item py-3">
                      <Bell className="w-5 h-5 mr-3" />
                      <span className="text-base">Notificações</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem className="menu-dropdown-item py-3">
                      <BookOpen className="w-5 h-5 mr-3" />
                      <span className="text-base">Documentação</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="menu-dropdown-item py-3">
                      <Question className="w-5 h-5 mr-3" />
                      <span className="text-base">Ajuda</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem className="menu-dropdown-item text-destructive py-3">
                      <SignOut className="w-5 h-5 mr-3" />
                      <span className="text-base">Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Revolutionary Navigation Menu */}
          <nav className="nav-glass p-3 shadow-2xl">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                className={currentView === 'dashboard' ? 
                  "menu-item active" : 
                  "menu-item"
                }
                onClick={() => setCurrentView('dashboard')}
              >
                <ChartBar className="menu-icon w-5 h-5 mr-3" />
                <span className="font-semibold text-base">Dashboard</span>
              </Button>
              <Button 
                variant="ghost" 
                className="menu-item"
                onClick={() => setCurrentView('domains')}
              >
                <Globe className="menu-icon w-5 h-5 mr-3" />
                <span className="font-semibold text-base">Domínios</span>
              </Button>
              <Button variant="ghost" className="menu-item">
                <Users className="menu-icon w-5 h-5 mr-3" />
                <span className="font-semibold text-base">Equipe</span>
              </Button>
              <Button 
                variant="ghost" 
                className="menu-item"
                onClick={() => setCurrentView('analytics')}
              >
                <Database className="menu-icon w-5 h-5 mr-3" />
                <span className="font-semibold text-base">Analytics</span>
              </Button>
              <Button variant="ghost" className="menu-item">
                <Gear className="menu-icon w-5 h-5 mr-3" />
                <span className="font-semibold text-base">Configurações</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section with Modern Design */}
        <div className="mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-4xl mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Bem-vinda, {mockUser.name.split(' ')[0]}! 👋
                </h2>
                <p className="text-muted-foreground text-xl">
                  Pronta para criar algo incrível hoje?
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center animate-float">
                  <Rocket className="w-12 h-12 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modern Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Projects Card */}
          <Card className="modern-card hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full animate-pulse">
                  +{Math.floor(Math.random() * 20) + 5}%
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                  {normalizedProjects.length}
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-3">Projetos Ativos</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendUp className="w-4 h-4 text-green-600" />
                  <span>{Math.floor(Math.random() * 5) + 1} novos esta semana</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Published Sites Card */}
          <Card className="modern-card hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-8 h-8 text-accent" />
                </div>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full">
                  +{normalizedProjects.filter(p => p.status === 'live').length}
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                  {normalizedProjects.filter(p => p.status === 'live').length}
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-3">Sites Publicados</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lightning className="w-4 h-4 text-yellow-600" />
                  <span>Deploy médio: 2.3s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Views Card */}
          <Card className="modern-card hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-purple-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full">
                  Em crescimento
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                  {(normalizedProjects.reduce((acc, p) => acc + p.views, 0) || Math.floor(Math.random() * 50000) + 10000).toLocaleString()}
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-3">Total de Views</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendUp className="w-4 h-4 text-purple-600" />
                  <span>+{Math.floor(Math.random() * 30) + 15}% este mês</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card className="modern-card hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-green-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-8 h-8 text-green-600" />
                </div>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full animate-pulse">
                  Excelente
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">
                  98.{Math.floor(Math.random() * 9) + 1}%
                </p>
                <p className="text-lg font-semibold text-muted-foreground mb-3">Uptime</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span>Todas regiões OK</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 modern-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                Atividade Recente
              </CardTitle>
              <CardDescription className="text-base">
                Acompanhe suas últimas ações na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "Deploy realizado",
                    project: "Landing Page Moderna", 
                    time: "há 2 horas",
                    icon: Rocket,
                    color: "text-green-600",
                    bgColor: "bg-green-100"
                  },
                  {
                    action: "Projeto editado",
                    project: "Portfolio Criativo",
                    time: "há 4 horas", 
                    icon: Code,
                    color: "text-blue-600",
                    bgColor: "bg-blue-100"
                  },
                  {
                    action: "Novo projeto criado",
                    project: "Blog Minimalista",
                    time: "há 1 dia",
                    icon: Plus,
                    color: "text-purple-600",
                    bgColor: "bg-purple-100"
                  }
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-300 hover-lift cursor-pointer group">
                    <div className={`w-12 h-12 ${activity.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.project}</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="modern-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                  <Lightning className="w-5 h-5 text-accent" />
                </div>
                Ações Rápidas
              </CardTitle>
              <CardDescription className="text-base">
                Acesso direto às funcionalidades mais usadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start h-12 hover-lift modern-button">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mr-3">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    Novo Projeto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl modern-card">
                  <DialogHeader>
                    <DialogTitle className="font-display text-3xl gradient-text">Escolha um Template</DialogTitle>
                    <DialogDescription className="text-lg">
                      Comece com um template profissional e personalize conforme sua necessidade
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {templateGallery.map(template => (
                      <Card 
                        key={template.id} 
                        className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group modern-card"
                        onClick={() => createProject(template)}
                      >
                        <div className="aspect-video overflow-hidden rounded-t-2xl">
                          <img 
                            src={template.preview} 
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                                {template.name}
                              </h4>
                              <p className="text-muted-foreground mt-2 text-base">{template.description}</p>
                            </div>
                            <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10">
                              {template.category}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full justify-start h-12 hover-lift modern-button" onClick={() => setCurrentView('analytics')}>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center mr-3">
                  <ChartBar className="w-4 h-4 text-purple-600" />
                </div>
                Ver Analytics
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-12 hover-lift modern-button">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                Convidar Equipe
              </Button>
              
              <Button variant="outline" className="w-full justify-start h-12 hover-lift modern-button">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                Documentação
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modern Projects Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="font-display text-3xl gradient-text">Seus Projetos</h3>
            <p className="text-muted-foreground mt-2 text-lg">
              {filteredProjects.length} de {normalizedProjects.length} projetos
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Enhanced Search Bar */}
            <div className="relative group">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 w-full sm:w-80 h-12 bg-muted/30 border-0 rounded-2xl backdrop-blur-sm focus:bg-white focus:shadow-lg transition-all duration-300"
              />
            </div>

            {/* Modern Filter Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant={showFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
                className={`flex items-center gap-2 h-12 px-4 rounded-2xl transition-all duration-300 ${
                  showFavorites 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl' 
                    : 'hover-lift modern-button'
                }`}
              >
                <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
                Favoritos
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 h-12 px-4 rounded-2xl hover-lift modern-button">
                    <FunnelSimple className="w-4 h-4" />
                    {selectedFilter === 'all' ? 'Todos' : getStatusText(selectedFilter as Project['status'])}
                    <CaretDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="modern-card">
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')} className="hover-glow">
                    Todos os projetos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('draft')} className="hover-glow">
                    <Warning className="w-4 h-4 mr-2 text-yellow-600" />
                    Rascunhos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('live')} className="hover-glow">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Online
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('deploying')} className="hover-glow">
                    <CloudCheck className="w-4 h-4 mr-2 text-blue-600" />
                    Publicando
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 h-12 px-4 rounded-2xl hover-lift modern-button">
                    <SortAscending className="w-4 h-4" />
                    <CaretDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="modern-card">
                  <DropdownMenuItem onClick={() => setSortBy('modified')} className="hover-glow">
                    <Clock className="w-4 h-4 mr-2" />
                    Mais recentes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')} className="hover-glow">
                    <TextT className="w-4 h-4 mr-2" />
                    Nome (A-Z)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('views')} className="hover-glow">
                    <Eye className="w-4 h-4 mr-2" />
                    Mais visualizados
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 h-12 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 modern-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl modern-card">
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl gradient-text">Escolha um Template</DialogTitle>
                  <DialogDescription className="text-lg">
                    Comece com um template profissional e personalize conforme sua necessidade
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {templateGallery.map(template => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group modern-card"
                      onClick={() => createProject(template)}
                    >
                      <div className="aspect-video overflow-hidden rounded-t-2xl">
                        <img 
                          src={template.preview} 
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {template.name}
                            </h4>
                            <p className="text-muted-foreground mt-2 text-base">{template.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10">
                            {template.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 && searchQuery ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar sua busca ou filtros para encontrar o que procura.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpar busca
            </Button>
          </Card>
        ) : filteredProjects.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl text-foreground mb-2">Nenhum projeto ainda</h3>
            <p className="text-muted-foreground mb-6">
              Crie seu primeiro projeto e comece a construir algo incrível!
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Projeto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Escolha um Template</DialogTitle>
                  <DialogDescription>
                    Comece com um template profissional e personalize conforme sua necessidade
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {templateGallery.map(template => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => createProject(template)}
                    >
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={template.preview} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{template.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => {
              const StatusIcon = getStatusIcon(project.status)
              return (
                <Card key={project.id} className="group hover:shadow-2xl transition-all duration-500 relative overflow-hidden hover-lift animate-fade-in-scale modern-card">
                  {/* Modern Status Indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-2 ${
                    project.status === 'live' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                    project.status === 'deploying' ? 'bg-gradient-to-r from-blue-400 to-blue-600 animate-shimmer' :
                    project.status === 'error' ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                  } rounded-t-2xl`} />

                  {/* Modern Favorite Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 z-10 w-10 h-10 p-0 glass-effect opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(project.id)
                    }}
                  >
                    <Star className={`w-5 h-5 transition-all duration-200 ${
                      project.favorite 
                        ? 'fill-yellow-400 text-yellow-400 animate-heartbeat' 
                        : 'text-gray-600 hover:text-yellow-400'
                    }`} />
                  </Button>

                  <div className="aspect-video overflow-hidden rounded-t-2xl relative">
                    <img 
                      src={project.preview} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {project.status === 'deploying' && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
                          <Rocket className="w-8 h-8 text-blue-600 animate-deploy-pulse" />
                        </div>
                      </div>
                    )}
                    {project.status === 'live' && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-glow shadow-lg">
                          ● LIVE
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate text-xl">
                            {project.name}
                          </h4>
                          {project.favorite && (
                            <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0 animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">{getStatusText(project.status)}</span>
                          </div>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{project.lastModified}</span>
                          </div>
                        </div>
                        {project.views > 0 && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              <span className="font-medium">{project.views.toLocaleString()} views</span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span className="font-medium">{project.collaborators.length} pessoas</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(project.status)} flex-shrink-0 ml-3 font-semibold px-3 py-1 rounded-full status-indicator`}
                      >
                        {getStatusText(project.status)}
                      </Badge>
                    </div>

                    {/* Enhanced Tags */}
                    {(project.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(project.tags || []).slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs py-1 px-3 hover:bg-primary/10 transition-colors rounded-full bg-muted/50">
                            #{tag}
                          </Badge>
                        ))}
                        {(project.tags || []).length > 3 && (
                          <Badge variant="secondary" className="text-xs py-1 px-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10">
                            +{(project.tags || []).length - 3} mais
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedProject(project)
                          setCurrentView('editor')
                        }}
                        className="flex-1 hover-grow modern-button h-10 rounded-2xl"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      
                      {project.status === 'live' && project.url ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Simulate view increment
                              setProjects((current = []) =>
                                current.map(p =>
                                  p.id === project.id ? { ...p, views: p.views + 1 } : p
                                )
                              )
                              window.open(project.url, '_blank')
                            }}
                            className="px-4 hover-grow modern-button h-10 rounded-2xl"
                          >
                            <ArrowSquareOut className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => shareProject(project)}
                            className="px-4 hover-grow modern-button h-10 rounded-2xl"
                          >
                            <Share className="w-4 h-4" />
                          </Button>
                        </>
                      ) : project.status === 'error' ? (
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => deployProject(project)}
                          className="px-4 h-10 rounded-2xl modern-button"
                        >
                          <Warning className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => deployProject(project)}
                          disabled={project.status === 'deploying'}
                          className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 px-4 hover-grow h-10 rounded-2xl modern-button shadow-lg"
                        >
                          <Rocket className={`w-4 h-4 ${project.status === 'deploying' ? 'animate-deploy-pulse' : ''}`} />
                        </Button>
                      )}

                      {/* Modern More Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="px-4 hover-grow h-10 rounded-2xl modern-button">
                            <Gear className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 modern-card">
                          <DropdownMenuItem onClick={() => duplicateProject(project)} className="hover-glow">
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar projeto
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleFavorite(project.id)} className="hover-glow">
                            <Star className={`w-4 h-4 mr-2 ${project.favorite ? 'fill-current text-yellow-500' : ''}`} />
                            {project.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          </DropdownMenuItem>
                          {project.url && (
                            <DropdownMenuItem onClick={() => shareProject(project)} className="hover-glow">
                              <Share className="w-4 h-4 mr-2" />
                              Compartilhar link
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => {}} className="hover-glow">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar código
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}} className="hover-glow">
                            <FolderOpen className="w-4 h-4 mr-2" />
                            Ver no explorador
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteProject(project.id)}
                            className="text-destructive focus:text-destructive hover-glow"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Excluir projeto
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-b from-card to-muted/20 border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Enhanced Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-xl animate-gradient-shift">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-display text-2xl gradient-text">PageCloud</h3>
                  <p className="text-sm text-muted-foreground">Desenvolvimento Web Simplificado</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Crie, edite e publique sites profissionais de forma visual e intuitiva. 
                A plataforma que democratiza o desenvolvimento web.
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  v2.1.4
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200 animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Online
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>10,000+ usuários ativos</span>
              </div>
            </div>

            {/* Documentation */}
            <div>
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-3 text-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                Documentação
              </h4>
              <nav className="space-y-4">
                {[
                  'Primeiros Passos',
                  'Guia do Editor',
                  'Templates & Temas',
                  'Deploy & Hospedagem',
                  'API Reference'
                ].map(link => (
                  <a key={link} href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-3 text-lg">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                Recursos
              </h4>
              <nav className="space-y-4">
                {[
                  'Centro de Ajuda',
                  'Comunidade',
                  'Blog & Tutoriais',
                  'Status da Plataforma',
                  'Changelog'
                ].map(link => (
                  <a key={link} href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Development */}
            <div>
              <h4 className="font-bold text-foreground mb-6 flex items-center gap-3 text-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-purple-600" />
                </div>
                Desenvolvimento
              </h4>
              <nav className="space-y-4">
                <a 
                  href="https://github.com/pagecloud/platform" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform group"
                >
                  <GitBranch className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Repositório GitHub
                </a>
                {[
                  'Reportar Bugs',
                  'Discussões',
                  'Wiki do Projeto',
                  'Releases'
                ].map(link => (
                  <a key={link} href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Enhanced Bottom Bar */}
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-6">
                  <span>© 2024 PageCloud. Todos os direitos reservados.</span>
                  <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-primary transition-colors">
                      Termos de Uso
                    </a>
                    <a href="#" className="hover:text-primary transition-colors">
                      Privacidade
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="font-medium">Todos os sistemas operacionais</span>
                </div>
                <Button variant="outline" size="sm" className="h-10 px-4 rounded-2xl hover-lift modern-button">
                  <Question className="w-4 h-4 mr-2" />
                  Suporte
                </Button>
              </div>
            </div>
            
            {/* Made with love */}
            <div className="text-center mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <span>Feito com</span>
                <Heart className="w-5 h-5 text-red-500 animate-heartbeat" />
                <span>no Brasil</span>
                <div className="mx-2 text-primary">•</div>
                <span>Powered by React & TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}