import { useEffect, useState, useRef } from 'react';
import { type FamilyMember } from '@/lib/familyData';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TreePine, Users, ZoomIn, ZoomOut, Heart, ChevronDown, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUser } from '@/lib/auth';

const API_URL = "https://kul-setu-backend.onrender.com";

interface TreeNode {
  member: FamilyMember;
  children: TreeNode[];
  x: number;
  y: number;
  spouse?: FamilyMember;
}

const FamilyTree = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [familyLines, setFamilyLines] = useState<string[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showRootView, setShowRootView] = useState(false);
  const [userFamilyId, setUserFamilyId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        // Check if user is logged in and get their family ID
        const loggedInUser = getUser();
        if (loggedInUser?.familyId) {
          setUserFamilyId(loggedInUser.familyId);
        }

        console.log("Fetching family members from backend...");
        const response = await fetch(`${API_URL}/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}) // empty search = return all
        });

        if (!response.ok) {
          throw new Error('Failed to fetch family members');
        }

        const familyMembers = await response.json();
        console.log("Fetched", familyMembers.length, "family members");
        setMembers(familyMembers);

        // Extract unique family lines
        const uniqueFamilyLines = Array.from(
          new Set(familyMembers
            .map((m: FamilyMember) => m.familyLineId)
            .filter((id: string | undefined) => id && id.trim() !== '')
          )
        ).sort() as string[];
        
        setFamilyLines(uniqueFamilyLines);
        
        // If user is logged in, show their family first, otherwise show first available family
        if (loggedInUser?.familyId && uniqueFamilyLines.includes(loggedInUser.familyId)) {
          setSelectedFamily(loggedInUser.familyId);
          setShowRootView(false); // Start with personal view
        } else if (uniqueFamilyLines.length > 0) {
          setSelectedFamily(uniqueFamilyLines[0]);
          setShowRootView(true); // Show root view if no personal family found
        }
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  useEffect(() => {
    if (selectedFamily && members.length > 0) {
      const familyMembers = members.filter(m => m.familyLineId === selectedFamily);
      if (familyMembers.length > 0) {
        const tree = showRootView ? buildTree(familyMembers) : buildImmediateFamily(familyMembers);
        setTreeData(tree);
        // Reset view when family changes
        setPosition({ x: 50, y: 50 });
        setScale(1);
      }
    }
  }, [selectedFamily, members, showRootView, userFamilyId]);

  const buildImmediateFamily = (familyMembers: FamilyMember[]): TreeNode[] => {
    // Get the logged-in user
    const loggedInUser = getUser();
    if (!loggedInUser?.personId) return [];

    // Find the logged-in user's family member record
    const userMember = familyMembers.find(m => m.personId === loggedInUser.personId);
    if (!userMember) return [];

    // Find spouse
    const spouse = familyMembers.find(m => m.personId === userMember.spouseId);

    // Find children (where user or spouse is parent)
    const children = familyMembers.filter(m => 
      m.fatherId === userMember.personId || 
      m.motherId === userMember.personId ||
      (spouse && (m.fatherId === spouse.personId || m.motherId === spouse.personId))
    );

    // Build the immediate family tree with user as root
    const childNodes = children.map((child, idx) => ({
      member: child,
      children: [], // Don't show grandchildren in immediate family view
      x: idx * 320,
      y: 280,
      spouse: undefined
    }));

    const userNode: TreeNode = {
      member: userMember,
      children: childNodes,
      x: Math.max(0, (children.length - 1) * 160), // Center the user above children
      y: 0,
      spouse: spouse
    };

    return [userNode];
  };

  const buildTree = (familyMembers: FamilyMember[]): TreeNode[] => {
    // Find root members (those without parents in the system or earliest generation)
    const minGeneration = Math.min(...familyMembers.map(m => m.generation));
    const roots = familyMembers.filter(m => 
      m.generation === minGeneration || (!m.fatherId && !m.motherId)
    );

    const buildNode = (member: FamilyMember, level: number, offset: number): TreeNode => {
      const children = familyMembers.filter(m => 
        m.fatherId === member.personId || m.motherId === member.personId
      );

      const uniqueChildren = children.filter((child, index, self) => 
        index === self.findIndex(c => c.personId === child.personId)
      );

      const childNodes = uniqueChildren.map((child, idx) => 
        buildNode(child, level + 1, offset + idx)
      );

      // Find spouse by looking for the other parent of this member's children
      const spouse = familyMembers.find(m => {
        if (m.personId === member.personId) return false;
        // Check if this person is the other parent of any of member's children
        return children.some(child => 
          (child.fatherId === member.personId && child.motherId === m.personId) ||
          (child.motherId === member.personId && child.fatherId === m.personId)
        );
      });

      return {
        member,
        children: childNodes,
        x: offset * 320, // Increased spacing
        y: level * 280,  // Increased vertical spacing
        spouse
      };
    };

    return roots.map((root, idx) => buildNode(root, 0, idx * 3));
  };

  const getInitials = (firstName: string) => {
    return firstName.length >= 2 ? firstName.substring(0, 2).toUpperCase() : firstName[0]?.toUpperCase() || '?';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('.tree-canvas')) {
      isDragging.current = true;
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const renderNode = (node: TreeNode): JSX.Element => {
    return (
      <div key={node.member.personId}>
        {/* Connection lines to children */}
        {node.children.length > 0 && (
          <svg className="absolute pointer-events-none" style={{ 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 0
          }}>
            {/* Vertical line down from parent */}
            <line
              x1={node.x + 140}
              y1={node.y + 200}
              x2={node.x + 140}
              y2={node.y + 250}
              stroke="hsl(var(--spiritual))"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* Horizontal line across children */}
            {node.children.length > 1 && (
              <line
                x1={node.children[0].x + 140}
                y1={node.y + 250}
                x2={node.children[node.children.length - 1].x + 140}
                y2={node.y + 250}
                stroke="hsl(var(--spiritual))"
                strokeWidth="2"
                opacity="0.3"
              />
            )}
            
            {/* Vertical lines to each child */}
            {node.children.map(child => (
              <line
                key={child.member.personId}
                x1={child.x + 140}
                y1={node.y + 250}
                x2={child.x + 140}
                y2={child.y}
                stroke="hsl(var(--spiritual))"
                strokeWidth="2"
                opacity="0.3"
              />
            ))}
          </svg>
        )}

        {/* Person card */}
        <div
          className="absolute transition-transform hover:scale-105"
          style={{
            left: node.x,
            top: node.y,
            zIndex: 1
          }}
        >
          <Link to={`/profile/${node.member.personId}`}>
            <Card className="w-[280px] border-spiritual/20 hover:border-spiritual/50 transition-all duration-300 hover:shadow-spiritual cursor-pointer group bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="w-20 h-20 border-2 border-spiritual/30 group-hover:border-spiritual transition-colors">
                    <AvatarFallback className="bg-gradient-spiritual text-white text-xl font-bold">
                      {getInitials(node.member.firstName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {node.member.firstName}
                    </h3>
                    <p className="text-xs text-spiritual font-medium mt-1">
                      Gen: {node.member.generation}
                    </p>
                    {node.member.gender && (
                      <p className="text-xs text-muted-foreground">
                        {node.member.gender === 'M' ? 'Male' : 'Female'}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap justify-center">
                    {node.member.bloodGroup && (
                      <span className="px-2 py-1 bg-spiritual/10 text-spiritual rounded-full text-xs">
                        {node.member.bloodGroup}
                      </span>
                    )}
                    {node.member.eyeColor && (
                      <span className="px-2 py-1 bg-spiritual/10 text-spiritual rounded-full text-xs">
                        {node.member.eyeColor}
                      </span>
                    )}
                  </div>

                  {/* Relationship indicators */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    {node.spouse && (
                      <div className="text-spiritual">💑 Married</div>
                    )}
                    {node.children.length > 0 && (
                      <div className="text-spiritual">👥 {node.children.length} child{node.children.length !== 1 ? 'ren' : ''}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Render children */}
        {node.children.map(child => renderNode(child))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-spiritual/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <TreePine className="w-16 h-16 text-spiritual animate-glow" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-spiritual bg-clip-text text-transparent">
            {showRootView ? 'Family Tree - Root View' : 'My Immediate Family'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            {showRootView ? 'Browse all family lineages and spiritual heritage' : 'Your spouse and children - your closest family bonds'}
          </p>
          
          {/* View Toggle and Family Selector */}
          {!loading && familyLines.length > 0 && (
            <div className="flex justify-center items-center space-x-4 mb-6">
              {/* Root View Toggle Button */}
              {userFamilyId && (
                <Button
                  onClick={() => {
                    setShowRootView(!showRootView);
                    if (!showRootView) {
                      // Switching to root view - keep current selection or show all
                    } else {
                      // Switching to immediate family view - show user's family
                      setSelectedFamily(userFamilyId);
                    }
                  }}
                  variant={showRootView ? "default" : "outline"}
                  className={showRootView ? "bg-spiritual text-white" : "border-spiritual/20 text-spiritual"}
                >
                  <TreePine className="w-4 h-4 mr-2" />
                  {showRootView ? 'My Family' : 'Full Tree'}
                </Button>
              )}
              
              {/* Family Selector - only show in root view or if no user family */}
              {(showRootView || !userFamilyId) && (
                <>
                  <label className="text-sm font-medium text-foreground">Select Family Line:</label>
                  <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                    <SelectTrigger className="w-64 border-spiritual/20">
                      <SelectValue placeholder="Choose a family line" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyLines.map(familyId => (
                        <SelectItem key={familyId} value={familyId}>
                          Family Line: {familyId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              
              {/* Show current family info in personal view */}
              {!showRootView && userFamilyId && (
                <div className="text-sm text-muted-foreground">
                  Viewing: Family Line {userFamilyId}
                </div>
              )}
            </div>
          )}

          {/* Statistics */}
          {!loading && selectedFamily && (
            <div className="flex justify-center space-x-8 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-spiritual">
                  {showRootView 
                    ? members.filter(m => m.familyLineId === selectedFamily).length
                    : treeData.length > 0 ? 1 + (treeData[0].spouse ? 1 : 0) + treeData[0].children.length : 0
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {showRootView ? 'Members in Family' : 'Immediate Family'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-spiritual">
                  {showRootView 
                    ? Math.max(...members.filter(m => m.familyLineId === selectedFamily).map(m => m.generation))
                    : treeData.length > 0 ? Math.max(1, treeData[0].children.length > 0 ? 2 : 1) : 1
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  {showRootView ? 'Generations' : 'Family Levels'}
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Heart className="w-12 h-12 text-spiritual mx-auto mb-4 animate-pulse" />
              <p className="text-lg text-muted-foreground">Loading family trees...</p>
            </div>
          </div>
        ) : !userFamilyId && !showRootView ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Please log in to view your immediate family</p>
              <p className="text-xs text-muted-foreground mb-4">Or switch to Full Tree to browse all families</p>
              <div className="space-y-2">
                <Link 
                  to="/auth" 
                  className="block text-spiritual hover:underline font-medium"
                >
                  Log in to your account
                </Link>
                <Button
                  onClick={() => setShowRootView(true)}
                  variant="outline"
                  className="border-spiritual/20 text-spiritual"
                >
                  <TreePine className="w-4 h-4 mr-2" />
                  Browse Full Family Tree
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !showRootView && treeData.length === 0 ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No immediate family members found</p>
              <p className="text-xs text-muted-foreground mb-4">You might not be registered in the family database yet</p>
              <div className="space-y-2">
                <Link 
                  to="/register" 
                  className="block text-spiritual hover:underline font-medium"
                >
                  Register your family profile
                </Link>
                <Button
                  onClick={() => setShowRootView(true)}
                  variant="outline"
                  className="border-spiritual/20 text-spiritual"
                >
                  <TreePine className="w-4 h-4 mr-2" />
                  Browse Full Family Tree
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : members.length === 0 ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No family members registered yet</p>
              <Link 
                to="/register" 
                className="text-spiritual hover:underline font-medium"
              >
                Register your first family member
              </Link>
            </CardContent>
          </Card>
        ) : familyLines.length === 0 ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No family lines found</p>
              <Link 
                to="/register" 
                className="text-spiritual hover:underline font-medium"
              >
                Register your first family member
              </Link>
            </CardContent>
          </Card>
        ) : !selectedFamily ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <TreePine className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Please select a family line to view the tree</p>
            </CardContent>
          </Card>
        ) : treeData.length === 0 ? (
          <Card className="max-w-md mx-auto border-spiritual/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No family tree structure found for this family line</p>
              <p className="text-xs text-muted-foreground">This may happen if family relationships are not properly defined</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            {/* Controls */}
            <div className="flex gap-2 mb-4 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(s => Math.min(s + 0.1, 2))}
                className="border-spiritual/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                className="border-spiritual/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setScale(1);
                  setPosition({ x: 50, y: 50 });
                }}
                className="border-spiritual/20"
              >
                Reset View
              </Button>
            </div>

            {/* Tree Canvas */}
            <div
              ref={containerRef}
              className="tree-canvas relative overflow-hidden border-2 border-spiritual/10 rounded-lg bg-gradient-to-br from-background to-spiritual/5"
              style={{ 
                height: '600px',
                cursor: isDragging.current ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: '0 0',
                  position: 'relative',
                  width: '3000px',
                  height: '2000px',
                  padding: '50px'
                }}
              >
                {treeData.map(node => renderNode(node))}
              </div>
            </div>

            <p className="text-center text-muted-foreground text-sm mt-4">
              Click and drag to pan • Use zoom buttons to adjust view
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
