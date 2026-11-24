/* =============================================================
   CODE SHOWN IN THE BACKGROUND
   Paste in snippets of your own code here. Each one needs a
   language ("cpp", "csharp" or "python") and the code itself.
   Keep lines under about 60 characters so they don't get cut off.
   Don't use backticks (`) or ${ inside the code.
   ============================================================= */

const CODE_SNIPPETS = [
  {
    language: "cpp",
    code: `// BTTask_SearchNearPlayer.cpp
EBTNodeResult::Type UBTTask_SearchNearPlayer::ExecuteTask(
    UBehaviorTreeComponent& OwnerComp, uint8* NodeMemory)
{
    UBlackboardComponent* BB = OwnerComp.GetBlackboardComponent();
    if (!BB) return EBTNodeResult::Failed;

    const float Idle = BB->GetValueAsFloat(IdleTimeKey);
    const FVector LastSeen = BB->GetValueAsVector(LastSeenKey);

    // The longer the player hides, the tighter the search
    const float Radius = FMath::GetMappedRangeValueClamped(
        FVector2D(0.f, MaxIdleTime),
        FVector2D(MaxRadius, MinRadius), Idle);

    FNavLocation Point;
    auto* Nav = UNavigationSystemV1::GetCurrent(GetWorld());
    if (Nav && Nav->GetRandomReachablePointInRadius(
            LastSeen, Radius, Point))
    {
        BB->SetValueAsVector(SearchSpotKey, Point.Location);
        return EBTNodeResult::Succeeded;
    }
    return EBTNodeResult::Failed;
}`,
  },
  {
    language: "csharp",
    code: `// FingerGun.cs
public class FingerGun : MonoBehaviour
{
    [SerializeField] int maxEffects = 3;
    readonly List<BulletEffect> loaded = new();

    public bool Load(BulletEffect effect)
    {
        if (loaded.Count >= maxEffects) return false;
        loaded.Add(effect);
        return true;
    }

    void OnWallHit(Bullet bullet, RaycastHit hit)
    {
        if (bullet.Step >= loaded.Count)
        {
            bullet.Despawn();
            return;
        }
        switch (loaded[bullet.Step++])
        {
            case BulletEffect.Ricochet:
                bullet.Dir = Vector3.Reflect(bullet.Dir, hit.normal);
                break;
            case BulletEffect.Splitter:
                SpawnSplit(bullet, hit, 25f);
                break;
            case BulletEffect.Explosion:
                Explode(hit.point, 3f);
                break;
        }
    }
}`,
  },
  {
    language: "python",
    code: `# line_up_tool.py
import maya.cmds as cmds


def line_up(spacing=2.0, align="start"):
    objs = cmds.ls(selection=True, transforms=True)
    if not objs:
        cmds.warning("Select some objects to line up.")
        return

    total = spacing * (len(objs) - 1)
    start = 0.0 if align == "start" else -total / 2.0

    for i, obj in enumerate(objs):
        x = start + i * spacing
        cmds.xform(obj, worldSpace=True, translation=(x, 0, 0))

    print("Lined up", len(objs), "objects")`,
  },
  {
    language: "cpp",
    code: `// DemonDog.h
UCLASS()
class FOSTERDOGS_API ADemonDog : public ACharacter
{
    GENERATED_BODY()

public:
    UPROPERTY(EditAnywhere, Category = "AI|Mood")
    float Hunger = 0.f;

    UPROPERTY(EditAnywhere, Category = "AI|Mood")
    float Loneliness = 0.f;

    UPROPERTY(EditAnywhere, Category = "AI|Mood")
    float Anger = 0.f;

    UFUNCTION(BlueprintCallable, Category = "AI")
    float GetAggression() const
    {
        return (Hunger + Loneliness + Anger) / 3.f;
    }
};`,
  },
  {
    language: "csharp",
    code: `// KnightController.cs
void Update()
{
    float move = Input.GetAxisRaw("Horizontal");
    body.velocity = new Vector2(move * speed, body.velocity.y);

    if (Input.GetButtonDown("Jump") && IsGrounded())
    {
        body.velocity = new Vector2(body.velocity.x, jumpForce);
    }
}

void OnTriggerEnter2D(Collider2D other)
{
    if (other.CompareTag("Trap"))
    {
        Respawn(lastCheckpoint);
    }
}`,
  },
];
