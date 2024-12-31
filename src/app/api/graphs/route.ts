import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const GRAPHS_DIR = path.join(process.cwd(), 'public', 'graphs');

// Ensure graphs directory exists
async function ensureGraphsDir() {
  try {
    await fs.access(GRAPHS_DIR);
  } catch {
    await fs.mkdir(GRAPHS_DIR, { recursive: true });
  }
}

// Default graph data
const defaultGraph = {
  nodes: [],
  edges: []
};

export async function GET() {
  await ensureGraphsDir();
  
  try {
    const files = await fs.readdir(GRAPHS_DIR);
    const graphs = {
      default: defaultGraph
    };
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(GRAPHS_DIR, file), 'utf-8');
        graphs[file.replace('.json', '')] = JSON.parse(content);
      }
    }
    
    return NextResponse.json(graphs);
  } catch (error) {
    console.error('Error reading graphs:', error);
    return NextResponse.json({ default: defaultGraph });
  }
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
    // Check if file exists
    const exists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (exists && !overwrite) {
      return NextResponse.json({ error: 'Graph already exists' }, { status: 400 });
    }

    // Save the graph
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving graph:', error);
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
    const exists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return NextResponse.json({ error: 'Graph not found' }, { status: 404 });
    }

    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting graph:', error);
    return NextResponse.json({ error: 'Failed to delete graph' }, { status: 500 });
  }
}
