import {
  FiSearch,
  FiUserPlus,
  FiSettings,
  FiWifi,
  FiPhoneCall,
  FiGlobe,
  FiKey,
  FiCheckSquare,
  FiMoreHorizontal,
} from "react-icons/fi";

export const menuItems = [
  { id: "pesquisar", label: "Pesquisar Cliente", icon: FiSearch },
  { id: "provisionar", label: "Provisionar Cliente", icon: FiUserPlus },
  { id: "bridge", label: "Bridge ONT Nokia", icon: FiSettings },
  { id: "wifi", label: "Configurar Wi-Fi", icon: FiWifi },
  { id: "telefone", label: "Configurar Telefone", icon: FiPhoneCall },
  { id: "vlan", label: "Alterar VLAN PPPOE", icon: FiGlobe },
  { id: "senha", label: "Alterar Senha Web", icon: FiKey },
  { id: "conferencia", label: "Conferência de Caixa", icon: FiCheckSquare },
  { id: "outras", label: "Outras Opções", icon: FiMoreHorizontal },
];
