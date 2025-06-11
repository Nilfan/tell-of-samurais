import { describe, it, expect, beforeEach } from "@jest/globals";
import { GameField } from "../GameFieldService";
import { Socket } from "socket.io";

describe("GameField", () => {
    let gameField: GameField;
    let mockSocket: Partial<Socket>;

    beforeEach(() => {
        gameField = new GameField();
        mockSocket = {
            id: "test-socket-id",
            on: jest.fn(),
            emit: jest.fn(),
            join: jest.fn(),
            leave: jest.fn(),
        };
    });

    it("should initialize with no players", () => {
        expect(gameField.player1).toBeUndefined();
        expect(gameField.player2).toBeUndefined();
    });

    it("should add first player", () => {
        gameField.addFirstPlayer(mockSocket as Socket);
        expect(gameField.player1).toBeDefined();
        expect(gameField.player1?.socket).toBe(mockSocket);
    });

    it("should add second player", () => {
        gameField.addFirstPlayer(mockSocket as Socket);
        const secondSocket = { ...mockSocket, id: "second-socket-id" };
        gameField.addSecondPlayer(secondSocket as Socket);
        expect(gameField.player2).toBeDefined();
        expect(gameField.player2?.socket).toBe(secondSocket);
    });

    it("should not allow more than two players", () => {
        gameField.addFirstPlayer(mockSocket as Socket);
        const secondSocket = { ...mockSocket, id: "second-socket-id" };
        gameField.addSecondPlayer(secondSocket as Socket);
        const thirdSocket = { ...mockSocket, id: "third-socket-id" };
        expect(() =>
            gameField.addSecondPlayer(thirdSocket as Socket),
        ).toThrow();
    });
});
