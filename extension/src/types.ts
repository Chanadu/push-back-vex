type PathNode = {
	x: number;
	y: number;
	heading: number;
};

type NodeData = {
	speed: string | undefined;
	direction: string | undefined;
	pos: PathNode;
};
