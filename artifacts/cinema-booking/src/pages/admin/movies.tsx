import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockMovies } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Edit } from "lucide-react";

export default function AdminMovies() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredMovies = mockMovies.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Movies Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="btn-add-movie"><Plus className="mr-2 h-4 w-4" /> Add Movie</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Movie title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input id="rating" placeholder="PG-13" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="poster">Poster URL</Label>
                <Input id="poster" placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Movie</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search movies..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell>
                  <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded" />
                </TableCell>
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>{movie.genre.slice(0, 2).join(", ")}</TableCell>
                <TableCell>{movie.duration}m</TableCell>
                <TableCell>
                  <Badge variant={movie.status === 'now-showing' ? 'default' : 'secondary'}>
                    {movie.status === 'now-showing' ? 'Now Showing' : 'Coming Soon'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}