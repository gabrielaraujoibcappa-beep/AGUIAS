'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { updateUserRole, linkStudentToMentor } from './actions'
import { Search, UserCog, Link as LinkIcon } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Profile = {
    id: string
    email: string
    full_name: string
    role: 'mentor' | 'student'
    created_at: string
}

export function AdminUserTable({ users, mentors }: { users: Profile[], mentors: Profile[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
    const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleRoleUpdate = async (userId: string, newRole: 'mentor' | 'student') => {
        try {
            await updateUserRole(userId, newRole)
        } catch (error) {
            console.error('Failed to update role:', error)
            alert('Erro ao atualizar função')
        }
    }

    const handleLink = async () => {
        if (!selectedStudent || !selectedMentor) return

        try {
            await linkStudentToMentor(selectedStudent, selectedMentor)
            setIsLinkDialogOpen(false)
            setSelectedStudent(null)
            setSelectedMentor(null)
            alert('Vínculo criado com sucesso!')
        } catch (error) {
            console.error('Failed to link:', error)
            alert('Erro ao criar vínculo')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar usuários..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.full_name || 'Sem nome'}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'mentor' ? 'default' : 'secondary'}>
                                        {user.role === 'mentor' ? 'Mentor' : 'Aluno'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    {user.role === 'student' && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRoleUpdate(user.id, 'mentor')}
                                            >
                                                <UserCog className="h-4 w-4 mr-1" />
                                                Promover
                                            </Button>

                                            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedStudent(user.id)}
                                                    >
                                                        <LinkIcon className="h-4 w-4 mr-1" />
                                                        Vincular
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Vincular Aluno a Mentor</DialogTitle>
                                                        <DialogDescription>
                                                            Selecione um mentor para {user.full_name}.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="mentor">Mentor</Label>
                                                            <Select onValueChange={setSelectedMentor}>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecione um mentor" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {mentors.map((mentor) => (
                                                                        <SelectItem key={mentor.id} value={mentor.id}>
                                                                            {mentor.full_name} ({mentor.email})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button onClick={handleLink} disabled={!selectedMentor}>
                                                            Confirmar Vínculo
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    )}
                                    {user.role === 'mentor' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRoleUpdate(user.id, 'student')}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Rebaixar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
