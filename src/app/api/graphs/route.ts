import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const GRAPHS_DIR = path.join(process.cwd(), 'src/graphs');

// Upewnij się, że folder istnieje
async function ensureGraphsDir() {
  try {
    await fs.access(GRAPHS_DIR);
  } catch {
    await fs.mkdir(GRAPHS_DIR, { recursive: true });
  }
}

export async function GET() {
  await ensureGraphsDir();
  
  const files = await fs.readdir(GRAPHS_DIR);
  const graphs = {};
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const content = await fs.readFile(path.join(GRAPHS_DIR, file), 'utf-8');
      graphs[file.replace('.json', '')] = JSON.parse(content);
    }
  }
  
  return NextResponse.json(graphs);
}

export async function POST(request: NextRequest) {
  await ensureGraphsDir();
  
  const { name, data, overwrite } = await request.json();
  
  if (!name || !data) {
    return NextResponse.json({ error: 'Name and data are required' }, { status: 400 });
  }

  if (name === 'default') {
    return NextResponse.json({ error: 'Cannot modify default graph' }, { status: 400 });
  }

  const filePath = path.join(GRAPHS_DIR, `${name}.json`);

  try {
    // Sprawdź czy plik już istnieje
    await fs.access(filePath);
    if (!overwrite) {
      return NextResponse.json({ error: 'Graph already exists' }, { status: 400 });
    }
  } catch {
    // Plik nie istnieje, można kontynuować
  }

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save graph' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (name === 'default') {
    return NextResponse.json({ error: 'Cannot delete default graph' }, { status: 400 });
  }

  const filePath = path.join(GRAPHS_DIR, `${name}.json`);
  
  try {
    await fs.access(filePath);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Graph not found' }, { status: 404 });
  }
}
