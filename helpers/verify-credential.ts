import { Agent, ProofEventTypes, ProofState, ProofStateChangedEvent } from "@aries-framework/core";
import { agentModules } from "../utils";
import { staticCredAttrs } from "../constants";

export const handleIncomingProofRequest = (agent: Agent<typeof agentModules>) => {
	agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
		if (payload.proofRecord.state === ProofState.RequestReceived) {
			console.log("Proof request received, sending back proof...");
			const requestedCredentials = await agent.proofs.selectCredentialsForRequest({
				proofRecordId: payload.proofRecord.id,
			});

			await agent.proofs.acceptRequest({
				proofRecordId: payload.proofRecord.id,
				proofFormats: requestedCredentials.proofFormats,
			});
		}
	});
};

export const handleAcceptedProofRequest = (agent: Agent<typeof agentModules>) => {
	agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
		if (payload.proofRecord.state === ProofState.Done) {
			console.log("Proof received, validating proof data");
			const proofData = await agent.proofs.getFormatData(payload.proofRecord.id);
			let isValid = true;
			const revealedAttrs = proofData.presentation?.anoncreds?.requested_proof.revealed_attrs!;
			const attrs = Object.keys(revealedAttrs);
			for (let attr of attrs) {
				console.log(
					`Expected: "${staticCredAttrs[attr as keyof typeof staticCredAttrs]}" Received: "${revealedAttrs[attr].raw}"`
				);
				if (revealedAttrs[attr].raw !== staticCredAttrs[attr as keyof typeof staticCredAttrs]) {
					isValid = false;
					break;
				}
			}
			console.log(`Proof Verification ${isValid ? "Success" : "Failed"}!`);
			console.log("SSI Flow completed");
			process.exit(0);
		}
	});
};

export const requestProof = async (verifierAgent: Agent<typeof agentModules>, connectionId: string, credDefId: string) => {
	const proofAttribute = {
		cropName: {
			name: "crop-name",
			restrictions: [
				{
					cred_def_id: credDefId,
				},
			],
		},
		cropSequence: {
			name: "crop-sequence",
			restrictions: [
				{
					cred_def_id: credDefId,
				},
			],
		},
		cropFunction: {
			name: "crop-function",
			restrictions: [
				{
					cred_def_id: credDefId,
				},
			],
		},
	};

	await verifierAgent.proofs.requestProof({
		protocolVersion: "v2",
		connectionId: connectionId,
		proofFormats: {
			anoncreds: {
				name: "proof-request",
				version: "1.0",
				requested_attributes: proofAttribute,
			},
		},
	});
};
