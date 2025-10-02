import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import {
  Bell,
  CheckCircle,
  Warning,
  XCircle,
  Rocket,
  Users,
  TrendUp,
  Clock,
  X,
  Gear,
  Globe,
  Code,
  Database,
  Lightning,
  BellRinging,
  BellSlash,
  DeviceMobile,
  EnvelopeSimple,
  Pulse,
  Play,
  Pause,
  SpeakerHigh,
  SpeakerSlash,
  Trash,
  Eye,
  EyeSlash,
  Plus
} from "@phosphor-icons/react"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'deploy' | 'security' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: 'deploy' | 'collaboration' | 'security' | 'system' | 'analytics' | 'billing'
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    projectId?: string
    userId?: string
    url?: string
    [key: string]: any
  }
}

interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
  email: boolean
  mobile: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  categories: {
    [key in Notification['category']]: {
      enabled: boolean
      priority: 'low' | 'medium' | 'high' | 'critical'
      methods: ('push' | 'email' | 'sms')[]
    }
  }
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Deploy concluído',
    message: 'Seu projeto "Landing Page Moderna" foi publicado com sucesso',
    timestamp: 'há 2 minutos',
    read: false,
    priority: 'high',
    category: 'deploy',
    metadata: {
      projectId: 'proj_123',
      url: 'https://landing-page-moderna.pagecloud.app'
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'Nova atualização disponível',
    message: 'PageCloud v2.2.0 traz novas funcionalidades e melhorias',
    timestamp: 'há 1 hora',
    read: false,
    priority: 'medium',
    category: 'system',
    persistent: true
  },
  {
    id: '3',
    type: 'warning',
    title: 'Limite de storage próximo',
    message: 'Você está usando 85% do seu plano. Considere fazer upgrade',
    timestamp: 'há 3 horas',
    read: true,
    priority: 'medium',
    category: 'billing'
  },
  {
    id: '4',
    type: 'success',
    title: 'Novo colaborador',
    message: 'João Silva aceitou o convite para o projeto "Portfolio Criativo"',
    timestamp: 'há 1 dia',
    read: true,
    priority: 'low',
    category: 'collaboration',
    metadata: {
      userId: 'user_456',
      projectId: 'proj_789'
    }
  },
  {
    id: '5',
    type: 'security',
    title: 'Login de novo dispositivo detectado',
    message: 'Detectamos um login do seu iPhone em São Paulo às 14:32',
    timestamp: 'há 2 dias',
    read: false,
    priority: 'critical',
    category: 'security',
    persistent: true
  }
]

const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  desktop: true,
  email: false,
  mobile: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  categories: {
    deploy: { enabled: true, priority: 'high', methods: ['push'] },
    collaboration: { enabled: true, priority: 'medium', methods: ['push', 'email'] },
    security: { enabled: true, priority: 'critical', methods: ['push', 'email', 'sms'] },
    system: { enabled: true, priority: 'low', methods: ['push'] },
    analytics: { enabled: false, priority: 'low', methods: ['push'] },
    billing: { enabled: true, priority: 'medium', methods: ['push', 'email'] }
  }
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', mockNotifications)
  const [settings, setSettings] = useKV<NotificationSettings>('notification-settings', defaultSettings)
  const [open, setOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [testNotificationText, setTestNotificationText] = useState('')
  const intervalRef = useRef<NodeJS.Timeout>()

  const unreadCount = (notifications || []).filter(n => !n.read).length
  const criticalCount = (notifications || []).filter(n => !n.read && n.priority === 'critical').length

  // Real-time notification simulation
  useEffect(() => {
    if (!realTimeEnabled || !settings) return

    const simulateRealTimeNotifications = () => {
      const eventTypes = [
        {
          type: 'deploy' as const,
          titles: ['Deploy concluído', 'Build falhou', 'Deploy iniciado'],
          messages: [
            'Projeto "Landing Page" foi publicado com sucesso',
            'Erro na compilação do projeto "Portfolio"', 
            'Iniciando deploy do projeto "E-commerce"'
          ],
          priority: 'high' as const,
          category: 'deploy' as const
        },
        {
          type: 'info' as const,
          titles: ['Analytics atualizadas', 'Novo visitante', 'Pico de tráfego'],
          messages: [
            'Relatório mensal disponível',
            '5 novos visitantes no seu site',
            'Tráfego aumentou 150% na última hora'
          ],
          priority: 'low' as const,
          category: 'analytics' as const
        },
        {
          type: 'success' as const,
          titles: ['Backup concluído', 'SSL renovado', 'Cache otimizado'],
          messages: [
            'Backup automático realizado com sucesso',
            'Certificado SSL renovado para mais 1 ano',
            'Performance melhorou em 40%'
          ],
          priority: 'medium' as const,
          category: 'system' as const
        }
      ]

      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const randomTitle = randomEvent.titles[Math.floor(Math.random() * randomEvent.titles.length)]
      const randomMessage = randomEvent.messages[Math.floor(Math.random() * randomEvent.messages.length)]

      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        type: randomEvent.type,
        title: randomTitle,
        message: randomMessage,
        timestamp: 'agora',
        read: false,
        priority: randomEvent.priority,
        category: randomEvent.category,
        metadata: {
          projectId: `proj_${Math.floor(Math.random() * 1000)}`
        }
      }

      setNotifications((current) => [newNotification, ...(current || [])])

      // Show browser notification if enabled
      if (settings?.desktop && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(randomTitle, {
          body: randomMessage,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        })
      }

      // Play notification sound if enabled
      if (settings?.sound) {
        // Use constant for audio data; allow volume to be set via settings (default 0.3)
        const audio = new Audio('data:audio/wav;base64,' + NOTIFICATION_SOUND_BASE64);
        audio.volume = settings?.soundVolume ?? 0.3;
        audio.play().catch(() => {}) // Ignore audio errors
      }

      // Show toast notification
      toast(randomTitle, {
        description: randomMessage,
        duration: 4000,
      })
    }

    // Simulate notifications every 15-45 seconds
    const startSimulation = () => {
      const randomDelay = 15000 + Math.random() * 30000 // 15-45 seconds
      intervalRef.current = setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance of notification
          simulateRealTimeNotifications()
        }
        startSimulation()
      }, randomDelay)
    }

    startSimulation()

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [realTimeEnabled, settings, setNotifications])

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      (prev || []).map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      (prev || []).map(n => ({ ...n, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => (prev || []).filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    toast.success('Todas as notificações foram removidas')
  }

  const sendTestNotification = () => {
    if (!testNotificationText.trim()) return

    const testNotification: Notification = {
      id: `test_${Date.now()}`,
      type: 'info',
      title: 'Notificação de Teste',
      message: testNotificationText,
      timestamp: 'agora',
      read: false,
      priority: 'medium',
      category: 'system'
    }

    setNotifications((current) => [testNotification, ...(current || [])])
    setTestNotificationText('')
    toast.success('Notificação de teste enviada!')
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning':
        return <Warning className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'info':
        return <TrendUp className="w-4 h-4 text-blue-600" />
      case 'deploy':
        return <Rocket className="w-4 h-4 text-purple-600" />
      case 'security':
        return <Warning className="w-4 h-4 text-red-600" />
      case 'system':
        return <Gear className="w-4 h-4 text-gray-600" />
      default:
        return <Bell className="w-4 h-4 text-blue-600" />
    }
  }

  const getTypeColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'critical') {
      return 'border-l-red-600 bg-red-50/50'
    }
    
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      case 'info':
        return 'border-l-blue-500'
      case 'deploy':
        return 'border-l-purple-500'
      case 'security':
        return 'border-l-red-500 bg-red-50/50'
      case 'system':
        return 'border-l-gray-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const getPriorityBadge = (priority: Notification['priority']) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 text-xs animate-pulse">CRÍTICO</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">ALTA</Badge>
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">MÉDIA</Badge>
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800 text-xs">BAIXA</Badge>
    }
  }

  const getCategoryIcon = (category: Notification['category']) => {
    switch (category) {
      case 'deploy':
        return <Rocket className="w-3 h-3" />
      case 'collaboration':
        return <Users className="w-3 h-3" />
      case 'security':
        return <Warning className="w-3 h-3" />
      case 'system':
        return <Gear className="w-3 h-3" />
      case 'analytics':
        return <TrendUp className="w-3 h-3" />
      case 'billing':
        return <Database className="w-3 h-3" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-bold animate-heartbeat"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notificações</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-auto p-2"
                  >
                    Marcar todas como lidas
                  </Button>
                )}
                <Badge variant="outline" className="text-xs">
                  {notifications.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma notificação por enquanto
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`
                        p-4 hover:bg-muted/50 transition-colors relative border-l-4 
                        ${getTypeColor(notification.type)}
                        ${!notification.read ? 'bg-primary/5' : ''}
                      `}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNotification(notification.id)}
                        className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </Button>

                      <div 
                        className="cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-foreground truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{notification.timestamp}</span>
                              </div>
                              {notification.action && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    notification.action!.onClick()
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}