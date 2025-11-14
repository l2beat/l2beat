-- AddForeignKey
ALTER TABLE "DeployedToken" ADD CONSTRAINT "DeployedToken_chain_fkey" FOREIGN KEY ("chain") REFERENCES "Chain"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
