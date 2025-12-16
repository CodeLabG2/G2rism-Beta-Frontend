export interface Role {
  id: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  department: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  roleId: string;
  department: string;
  avatar?: string;
}
