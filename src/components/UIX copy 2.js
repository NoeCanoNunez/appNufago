import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Home, User, Settings, HelpCircle, BarChart, FileText, ShoppingCart, Package, Truck, Database, DollarSign, Calendar, PhoneCall, Briefcase, ShoppingBag } from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Home', subItems: ['Ir a Home'] },
  { icon: User, label: 'Mi Cuenta', subItems: ['Detalle de mis Pagos', 'Pagar mi cuenta'] },
  { icon: Settings, label: 'Aprobaciones' },
  { icon: HelpCircle, label: 'Soporte' },
  { icon: BarChart, label: 'Administración' },
  { icon: FileText, label: 'Tablas' },
  { icon: ShoppingCart, label: 'Presupuesto' },
  { icon: Package, label: 'Obra/Sucursal' },
  { icon: Truck, label: 'Compras' },
  { icon: Database, label: 'Recepciones' },
  { icon: Package, label: 'Almacén' },
  { icon: FileText, label: 'Tratos' },
  { icon: DollarSign, label: 'Contabilidad' },
  { icon: FileText, label: 'Estados de Pago' },
  { icon: PhoneCall, label: 'Asistencia en línea' },
  { icon: Briefcase, label: 'Maquinaria en Arriendo' },
  { icon: ShoppingBag, label: 'Ventas Web' },
]

export default function Component() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeItem, setActiveItem] = useState(null)
  const [expandedItem, setExpandedItem] = useState(null)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const handleItemClick = (label) => {
    setActiveItem(label)
    if (expandedItem === label) {
      setExpandedItem(null)
    } else {
      setExpandedItem(label)
    }
  }

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen bg-white shadow-lg"
      initial={{ width: isOpen ? 250 : 60 }}
      animate={{ width: isOpen ? 250 : 60 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md"
      >
        <ChevronRight className={`w-5 h-5 transition-transform ${isOpen && "rotate-180"}`} />
      </button>
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center mb-6">
          <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="w-10 h-10 rounded-full mr-3" />
          {isOpen && <span className="font-semibold">OPERACIONES</span>}
        </div>
        {menuItems.map((item) => (
          <div key={item.label} className="mb-2">
            <button
              onClick={() => handleItemClick(item.label)}
              className={`flex items-center w-full p-2 rounded-md transition-colors ${ activeItem === item.label ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}` }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {isOpen && (
                <>
                  <span className="flex-grow text-left">{item.label}</span>
                  {item.subItems && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedItem && "rotate-180"}`} />
                  )}
                </>
              )}
            </button>
            <AnimatePresence>
              {isOpen && expandedItem === item.label && item.subItems && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem}
                      className="w-full p-2 pl-10 text-left hover:bg-gray-100 transition-colors"
                    >
                      {subItem}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}