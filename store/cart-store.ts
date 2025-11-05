import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  // Estado
  cart: CartItem[]
  userId: string | null
  isHydrated: boolean

  // Ações do carrinho
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  updateQty: (itemId: number, newQty: number) => void
  removeFromCart: (itemId: number) => void
  clearCart: () => void
  getItemQuantity: (itemId: number) => number
  getTotalPrice: () => number
  getTotalItems: () => number

  // Ações de usuário
  setUserId: (userId: string | null) => void
  resetForNewUser: () => void
  setHydrated: () => void
}

// Função helper para gerar chave única por usuário
const getStorageKey = (userId: string | null) => {
  return userId ? `cart-${userId}` : 'cart-guest'
}

// Função para carregar carrinho de um usuário específico
const loadUserCart = (userId: string | null): CartItem[] => {
  try {
    const storageKey = getStorageKey(userId)
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      const parsed = JSON.parse(savedData)
      return parsed.state?.cart || []
    }
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error)
  }
  return []
}

// Função para salvar carrinho de um usuário específico
const saveUserCart = (userId: string | null, cart: CartItem[]) => {
  try {
    const storageKey = getStorageKey(userId)
    localStorage.setItem(storageKey, JSON.stringify({ state: { cart } }))
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error)
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cart: [],
      userId: null,
      isHydrated: false,

      // Adicionar item ao carrinho
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.id === item.id)

          let newCart: CartItem[]
          if (existingItem) {
            newCart = state.cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          } else {
            newCart = [...state.cart, { ...item, quantity: 1 }]
          }

          // Salvar imediatamente
          saveUserCart(state.userId, newCart)

          return { cart: newCart }
        })
      },
      updateQty: (itemId: number, newQty: number) => {
        set((state) => {
          const existingItem = state.cart.find((cartItem) => cartItem.id === itemId)

          let newCart: CartItem[]
          if (existingItem) {
            newCart = state.cart.map((cartItem) =>
              cartItem.id === itemId
                ? { ...cartItem, quantity: newQty }
                : cartItem
            )
            saveUserCart(state.userId, newCart)
            return { cart: newCart }
          }
          return { state }
        })
      },

      // Remover item do carrinho
      removeFromCart: (itemId) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === itemId)

          let newCart: CartItem[]
          if (existingItem && existingItem.quantity > 1) {
            newCart = state.cart.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          } else {
            newCart = state.cart.filter((item) => item.id !== itemId)
          }

          // Salvar imediatamente
          saveUserCart(state.userId, newCart)

          return { cart: newCart }
        })
      },

      // Limpar carrinho
      clearCart: () => {
        set((state) => {
          saveUserCart(state.userId, [])
          return { cart: [] }
        })
      },

      // Obter quantidade de um item
      getItemQuantity: (itemId) => {
        const item = get().cart.find((item) => item.id === itemId)
        return item ? item.quantity : 0
      },

      // Calcular preço total
      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      // Calcular total de itens
      getTotalItems: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      // Definir ID do usuário e carregar carrinho correspondente
      setUserId: (userId) => {
        const currentUserId = get().userId

        // Se mudou de usuário ou é a primeira vez definindo
        if (currentUserId !== userId) {
          // Salva o carrinho atual antes de mudar
          if (currentUserId !== null) {
            saveUserCart(currentUserId, get().cart)
          }

          // Carrega o carrinho do novo usuário
          const userCart = loadUserCart(userId)

          set({ cart: userCart, userId, isHydrated: true })
        } else if (!get().isHydrated) {
          // Se for o mesmo usuário mas ainda não hidratou, força o carregamento
          const userCart = loadUserCart(userId)
          set({ cart: userCart, isHydrated: true })
        }
      },

      // Resetar para novo usuário
      resetForNewUser: () => {
        set({ cart: [], userId: null, isHydrated: false })
        localStorage.removeItem('cart-guest')
      },

      // Marcar como hidratado
      setHydrated: () => {
        set({ isHydrated: true })
      },
    }),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
      }),
      onRehydrateStorage: () => (state) => {
        // Após hidratar, carrega o carrinho do usuário salvo
        if (state?.userId) {
          const userCart = loadUserCart(state.userId)
          state.cart = userCart
          state.isHydrated = true
        }
      },
    }
  )
)

// Store separada para favoritos (também por usuário)
interface FavoritesStore {
  favorites: Record<number, boolean>
  userId: string | null
  isHydrated: boolean
  toggleFavorite: (itemId: number) => void
  setUserId: (userId: string | null) => void
  isFavorite: (itemId: number) => boolean
  setHydrated: () => void
}

// Funções helper para favoritos
const loadUserFavorites = (userId: string | null): Record<number, boolean> => {
  try {
    const storageKey = `favorites-${userId || 'guest'}`
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      const parsed = JSON.parse(savedData)
      return parsed.state?.favorites || {}
    }
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error)
  }
  return {}
}

const saveUserFavorites = (userId: string | null, favorites: Record<number, boolean>) => {
  try {
    const storageKey = `favorites-${userId || 'guest'}`
    localStorage.setItem(storageKey, JSON.stringify({ state: { favorites } }))
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error)
  }
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: {},
      userId: null,
      isHydrated: false,

      toggleFavorite: (itemId) => {
        set((state) => {
          const newFavorites = {
            ...state.favorites,
            [itemId]: !state.favorites[itemId],
          }

          // Salvar imediatamente
          saveUserFavorites(state.userId, newFavorites)

          return { favorites: newFavorites }
        })
      },

      setUserId: (userId) => {
        const currentUserId = get().userId

        if (currentUserId !== userId) {
          // Salva os favoritos atuais antes de mudar
          if (currentUserId !== null) {
            saveUserFavorites(currentUserId, get().favorites)
          }

          // Carrega os favoritos do novo usuário
          const userFavorites = loadUserFavorites(userId)

          set({ favorites: userFavorites, userId, isHydrated: true })
        } else if (!get().isHydrated) {
          // Se for o mesmo usuário mas ainda não hidratou, força o carregamento
          const userFavorites = loadUserFavorites(userId)
          set({ favorites: userFavorites, isHydrated: true })
        }
      },

      isFavorite: (itemId) => {
        return !!get().favorites[itemId]
      },

      setHydrated: () => {
        set({ isHydrated: true })
      },
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
      }),
      onRehydrateStorage: () => (state) => {
        // Após hidratar, carrega os favoritos do usuário salvo
        if (state?.userId) {
          const userFavorites = loadUserFavorites(state.userId)
          state.favorites = userFavorites
          state.isHydrated = true
        }
      },
    }
  )
)