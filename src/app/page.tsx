import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#E31937] rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">Tesla Tracking</CardTitle>
          <CardDescription className="text-lg mt-2">
            Consulta el estado de tu pedido Tesla en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-center text-muted-foreground text-sm max-w-xs">
            Conecta tu cuenta de Tesla para ver el estado de tus pedidos, VIN, y configuración de vehículos.
          </div>
          
          <Link href="/auth/tesla-popup">
            <Button 
              size="lg" 
              className="w-full bg-[#E31937] hover:bg-[#c41230] text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Conectar con Tesla
            </Button>
          </Link>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            Seguro y privado. Tus datos solo se usan para consultar tus pedidos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
