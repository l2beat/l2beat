-- The replacement index was built concurrently; attaching it as the primary
-- key only takes the brief lock needed to swap the constraint. One
-- transaction can now store a record per grouping key.
ALTER TABLE "Liveness"
DROP CONSTRAINT "Liveness_pkey",
ADD CONSTRAINT "Liveness_pkey" PRIMARY KEY USING INDEX "Liveness_new_pkey";
