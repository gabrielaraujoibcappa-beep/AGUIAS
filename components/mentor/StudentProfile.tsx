import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PrivateNotes } from "./PrivateNotes"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

interface StudentProfileProps {
    student: any
    mentorId: string
}

export function StudentProfile({ student, mentorId }: StudentProfileProps) {
    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-24 w-24 border-4 border-slate-50">
                            <AvatarImage src={student.avatar_url} />
                            <AvatarFallback className="text-2xl bg-slate-100 text-slate-500">
                                {student.full_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{student.full_name}</h2>
                            <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Aluno Ativo
                        </Badge>
                    </div>

                    <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                        <div className="flex items-center text-sm text-slate-600">
                            <Mail className="h-4 w-4 mr-3 text-slate-400" />
                            {student.email}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <Calendar className="h-4 w-4 mr-3 text-slate-400" />
                            Entrou em Nov 2024
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Private Notes */}
            <PrivateNotes studentId={student.id} mentorId={mentorId} />
        </div>
    )
}
