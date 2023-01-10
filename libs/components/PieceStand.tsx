import { Text } from "@chakra-ui/react";
import { PieceType } from "../shogi";

type Props = {
    pieceInHand: Map<PieceType, number>,
};

const PieceStand = (props: Props) => {

    const { pieceInHand } = props;

    return <>
    
    {
        Array.from(pieceInHand.entries()).map(([key, val]) => {
            return <Text key={key}>{key}: {val}</Text>
        })
    }
    </>
};

export { PieceStand }