# diffusion是纯粹的，仅限于data based的方法

## 摘要

本文讨论一个在机器人、控制和规划任务中经常被忽略的问题：diffusion 是否能够在训练或推理过程中真正融入 model based 信息。这里的结论是明确的：**标准 diffusion 是纯粹的、仅限于 data based 的方法**。它可以拟合由数据呈现出来的分布，也可以拟合被筛选、重加权或重新标注后的数据分布，但它并不会因此变成 model based 方法。

核心原因在于：真实环境反馈、任务成功、动力学可执行性、碰撞约束、抓取质量等评价，原则上只对最终物理样本或最终执行轨迹有意义。也就是说，它们定义在终点数据分布 $x_0$ 上，而不是定义在 diffusion 的中间噪声层级 $x_t$ 上。

从 MDP 的角度看，model based 方法依赖真实状态转移、奖励函数、价值递推和 Bellman 最优性。从 diffusion 的角度看，反向采样过程只是从高斯噪声到数据分布的概率生成路径。二者的“轨迹”不是同一种对象。因此，将 model based 评分函数插入 diffusion 的中间采样过程，既没有环境语义，也没有 Bellman 一致性，最终只会破坏 diffusion 拟合数据分布的能力。

---

## 1. 问题的核心

在许多任务中，我们拥有一个最终评分函数，例如：

- 机器人轨迹是否可执行；
- 抓取是否稳定；
- 是否避免碰撞；
- 是否满足动力学约束；
- 是否完成任务目标；
- 控制器是否能够跟踪参考轨迹。

这些评分函数可以统一写成：

$$
R(x_0)
$$

其中 $x_0$ 表示最终生成样本，也就是 diffusion 反向采样结束后的结果。

关键问题是：这个评分函数是否能够用于 diffusion 的中间状态 $x_t$？答案是否定的。

因为 $x_t$ 并不是一个真实物理样本，也不是一个真实环境状态。它只是 $x_0$ 被前向加噪后得到的随机变量。对 $x_t$ 直接计算 $R(x_t)$，通常没有明确语义。

因此，一个定义在最终样本上的环境反馈，不能直接变成中间噪声层级上的 reward、cost 或 score。

---

## 2. data based 与 model based 的区别

需要先区分两个概念。

### 2.1 data based

data based 方法的核心是拟合数据分布。给定数据集：

$$
\mathcal{D}=\{x_0^i\}_{i=1}^N
$$

模型试图学习经验分布：

$$
p_{\text{data}}(x_0)
$$

diffusion 的训练目标本质上是学习这个数据分布经过不同噪声层级后的 score：

$$
\nabla_{x_t}\log p_t(x_t)
$$

其中 $p_t(x_t)$ 是数据分布 $p_{\text{data}}(x_0)$ 经过前向加噪过程诱导出的边缘分布。

因此，标准 diffusion 的本质是：

> 从数据出发，学习每一个噪声层级上的数据分布结构。

### 2.2 model based

model based 方法则不同。它依赖某种显式模型，例如：

- 环境动力学；
- 状态转移模型；
- 约束方程；
- 奖励函数；
- 可达性模型；
- 控制器模型；
- 接触动力学；
- Bellman backup；
- 规划或最优控制目标。

在 MDP 中，这通常写作：

$$
\mathcal{M}=(\mathcal{S},\mathcal{A},P,r,\gamma)
$$

其中 $\mathcal{S}$ 是状态空间，$\mathcal{A}$ 是动作空间，$P(s'|s,a)$ 是环境转移模型，$r(s,a)$ 是奖励函数，$\gamma$ 是折扣因子。

model based 方法的核心不是拟合数据分布，而是利用 $P$ 和 $r$ 推导或搜索最优行为。

---

## 3. 从 MDP 角度看：真实反馈只在物理轨迹中成立

在 MDP 中，一条真实轨迹是：

$$
\tau=(s_0,a_0,s_1,a_1,\dots,s_T)
$$

它的回报是：

$$
G(\tau)=\sum_{t=0}^{T}\gamma^t r(s_t,a_t)
$$

这里的每一个 $s_t$ 都是环境中的真实状态，每一个 $a_t$ 都是施加到环境中的真实动作。因此，reward 的含义依赖真实环境转移：

$$
s_{t+1}\sim P(s_{t+1}|s_t,a_t)
$$

Bellman 最优性成立的基础是：当前状态 $s_t$ 与后续最优价值之间存在递推关系：

$$
V^*(s)=\max_a\left[r(s,a)+\gamma\mathbb{E}_{s'\sim P(\cdot|s,a)}V^*(s')\right]
$$

这个递推关系依赖两个事实。

第一，$s$ 是真实环境状态。

第二，动作 $a$ 会通过环境转移 $P$ 影响未来状态。

如果这两个条件不成立，Bellman 最优性就没有定义基础。

---

## 4. diffusion 的中间层级不是 MDP 状态

diffusion 的前向过程通常可以写成：

$$
x_t=\sqrt{\bar{\alpha}_t}x_0+\sqrt{1-\bar{\alpha}_t}\epsilon,\quad \epsilon\sim\mathcal{N}(0,I)
$$

这里的 $x_t$ 是 $x_0$ 的加噪版本。

反向生成过程是：

$$
x_T\rightarrow x_{T-1}\rightarrow\cdots\rightarrow x_0
$$

这看起来像一条 trajectory，但它不是物理时间上的轨迹。它不是：

$$
s_0\rightarrow a_0\rightarrow s_1\rightarrow a_1\rightarrow\cdots
$$

diffusion 的中间状态 $x_t$ 不是环境状态，反向 step 也不是环境动作。它们只是概率生成过程中的中间变量。

因此，diffusion 的中间链条不满足 MDP 的基本结构：

- $x_t$ 不是真实状态；
- 从 $x_t$ 到 $x_{t-1}$ 不是环境动力学；
- 中间 step 没有真实环境反馈；
- 中间 step 没有 Bellman value-to-go；
- 中间变量不对应可执行的物理轨迹节点。

所以，不能把 diffusion 的 denoising step 当作 planning step。

---

## 5. 最终评分函数不能直接搬到中间层级

假设我们有一个最终评分函数：

$$
R(x_0)
$$

如果我们希望生成高评分样本，理想目标分布可以写成：

$$
p^*(x_0)\propto p_{\text{data}}(x_0)\exp(\beta R(x_0))
$$

这表示我们希望提高高 reward 样本的概率。

但是，diffusion 中间层级上真正对应的分布不是简单的 $p^*(x_t)$，而是由前向加噪过程边缘化得到：

$$
p_t^*(x_t)=\int q(x_t|x_0)p_{\text{data}}(x_0)\exp(\beta R(x_0))dx_0
$$

因此，中间层级上的正确 score 应该是：

$$
\nabla_{x_t}\log p_t^*(x_t)
$$

而不是：

$$
\nabla_{x_t}R(x_t)
$$

这正是问题的核心。

$R$ 是定义在 $x_0$ 上的函数。$x_t$ 只是噪声变量。直接计算 $R(x_t)$ 或 $\nabla R(x_t)$，通常没有物理意义，也不是目标分布的正确 score。

---

## 6. 推理时的中间 guidance 为什么没有原则性依据

许多方法试图在 diffusion 反向采样过程中加入额外评分函数，例如：

- collision cost；
- inverse kinematics cost；
- dynamics feasibility cost；
- controller tracking cost；
- task reward；
- grasp quality score。

它们通常试图修改反向过程：

$$
x_{t-1}=\mu_\theta(x_t,t)+\sigma_t\epsilon
$$

将其中的噪声或更新方向替换为某种优化结果或梯度修正。

但问题是：这些评分函数原本都属于最终物理样本 $x_0$，而不是属于中间噪声变量 $x_t$。

因此，在中间层级使用这些函数，本质上是在做：

$$
\text{data score}+\text{external heuristic gradient}
$$

这不是一个严格的 posterior sampling，也不是一个 Bellman-consistent control process。

结果通常是：

- 简单任务中可能有局部收益；
- 复杂任务中生成质量下降；
- 多个约束之间互相拉扯；
- 样本离开原始数据流形；
- 后续 denoising step 面对 off-distribution 的 $x_t$；
- 最终生成结果不再对应原始 diffusion 分布。

这不是优化器强弱的问题，而是对象错位的问题。

---

## 7. 真正需要的是每一层的 value-to-go

如果一定要在中间层级使用最终 reward，那么中间层级上真正需要的不是 $R(x_t)$，而是从当前噪声状态继续生成后能够得到高 reward 终点样本的概率。

一个更合理的对象是：

$$
V_t(x_t)=\log\mathbb{E}\left[\exp(\beta R(x_0))\mid x_t\right]
$$

这个 $V_t(x_t)$ 才类似于 diffusion 生成过程中的 value-to-go。

它表达的是：给定当前中间变量 $x_t$，继续按照正确反向过程采样，未来产生高 reward $x_0$ 的可能性有多大。

但是，标准 diffusion 并没有学习 $V_t$。它学习的是：

$$
\nabla_{x_t}\log p_t(x_t)
$$

而不是：

$$
\nabla_{x_t}V_t(x_t)
$$

如果我们真的拥有所有层级上的 $V_t$，并且这些 $V_t$ 满足类似 Bellman 或 HJB 的一致性，那么我们已经拥有了一个规划器或最优控制器。

这时 diffusion 反而不再是必要的。

---

## 8. 任意层级满足 Bellman 最优性几乎不可得

要让 diffusion 的中间 guidance 真正成立，需要一个极强条件：任意噪声层级的数据分布都要符合最终任务的 Bellman 最优性。

也就是说，每一个 $x_t$ 都必须有明确的 value-to-go，并且不同层级之间需要满足一致递推：

$$
V_t(x_t)=\operatorname{SoftBellman}\left[V_{t-1},R,P\right]
$$

这里的写法只是表达概念：中间层级的价值必须由未来最优价值一致地推出。

但现实世界的规划问题远远比这个复杂。真实任务中存在：

- 长期依赖；
- 稀疏奖励；
- 接触不连续；
- 部分可观测；
- 多模态策略；
- 动力学约束；
- 控制器限制；
- 环境反馈延迟；
- 任务成功与几何可行性之间的冲突。

这些结构不可能自动存在于 diffusion 的每一个噪声层级中。

更重要的是，如果这些 Bellman-consistent value structures 已经可得，那么问题本身已经被解决。此时可以直接使用 planning、optimal control、MPC、dynamic programming 或 trajectory optimization，而没有必要绕道使用 diffusion。

因此，这个条件在现实中基本不可得；即使可得，diffusion 也失去了必要性。

---

## 9. 训练阶段也无法真正融入 model based 信息

有人可能认为：如果推理时不能使用 model based score，那么是否可以在训练时融入？

这里必须区分两件事。

### 9.1 可以改变数据

我们可以使用 model based 函数来筛选数据：

$$
x_0\sim p_{\text{data}}(x_0|R(x_0)>\tau)
$$

也可以重加权数据：

$$
p_{\text{data}}^w(x_0)\propto w(R(x_0))p_{\text{data}}(x_0)
$$

还可以把 reward、constraint 或 task label 作为条件变量：

$$
\epsilon_\theta(x_t,t,c)
$$

但这些做法并没有改变 diffusion 的训练范式。它们只是改变了 diffusion 所拟合的数据对象。

### 9.2 这不是 model based 融入

无论数据如何被筛选、重加权或标注，diffusion 最终仍然在学习某个数据分布的 score：

$$
\nabla_{x_t}\log p_t(x_t)
$$

其中 $p_t$ 仍然是某个数据分布经过加噪后得到的边缘分布。

model based 函数在这里最多扮演了：

- 数据预处理器；
- 数据筛选器；
- 标签生成器；
- 权重生成器；
- 任务定义器。

它没有成为 diffusion 训练机制的一部分。

因此，所谓“在训练中融入 model based 信息”，更准确地说只是：

> 在训练 diffusion 之前，用 model based 信息改变数据分布。

这仍然是 data based 范式。

---

## 10. 蒸馏 model based score 为什么不能解决问题

另一种想法是：将最终评分函数或 model based reward 蒸馏到一个网络里，然后在 diffusion 中间层级使用。

但问题仍然存在。

如果蒸馏的是：

$$
\nabla R(x_t)
$$

那么它没有语义，因为 $x_t$ 不是最终物理样本。

如果蒸馏的是正确的中间 score：

$$
\nabla_{x_t}\log p_t^*(x_t)
$$

那么这本质上已经是在学习新的目标分布 $p^*$ 的 diffusion score。

也就是说，这不是把 model based reward 无损接入原 diffusion，而是重新训练或近似训练了另一个 diffusion model。

因此，蒸馏并没有消除根本问题。它要么蒸馏了错误对象，要么退化为重新学习一个新数据分布。

---

## 11. diffusion 可以利用 model based 生成的数据，但不能变成 model based

需要承认一个边界情况：可以先用 model based planner 生成高质量轨迹，再用 diffusion 学习这些轨迹的分布。

例如：

$$
\mathcal{D}_{\text{planner}}=\{x_0^i\}_{i=1}^N
$$

然后训练 diffusion 去拟合：

$$
p_{\text{planner-data}}(x_0)
$$

这在工程上当然是可行的。

但是，这仍然不是 diffusion 变成了 model based 方法。真正的 model based 工作发生在数据生成阶段。diffusion 只是学习了 planner 产生的数据分布。

换句话说：

> diffusion 可以模仿 model based 方法的输出，但它并不继承 model based 方法的内部原理。

它学到的是结果分布，而不是规划机制本身。

---

## 12. 为什么“从头 sample”仍然是最干净的方式

如果我们不希望破坏 diffusion 的生成路径，那么最干净的推理方式仍然是：

1. 从原始 diffusion 分布完整采样得到 $x_0$；
2. 在终点处计算真实评分 $R(x_0)$；
3. 进行 ranking、rejection、selection 或 resampling。

这类方法代价可能很高，但至少概念上是干净的。

因为评分函数只在它有语义的地方使用：终点样本 $x_0$。

相比之下，在中间层级使用评分函数，等价于假设 $R$ 可以被解释为噪声层级上的局部价值或局部能量。但这个假设通常不成立。

因此，从原理上说：

> 终点评分是合理的；中间评分是不合理的。

---

## 13. 最终命题

本文的核心命题可以概括为：

> diffusion 是纯粹的、仅限于 data based 的方法。它的训练目标是拟合数据分布在各个噪声层级上的 score，而不是求解环境中的 Bellman 最优控制问题。真实环境反馈只在最终物理样本或最终执行轨迹处有意义，不能直接搬到 diffusion 中间噪声状态上使用。训练前的筛选、重加权、标注或数据生成，只是改变了 diffusion 所拟合的数据对象，而没有改变 diffusion 的 data based 本质。推理时在中间轨迹插入 model based score/reward，则缺乏 Bellman 一致性，并会破坏原始生成分布。

更简洁地说：

$$
\text{diffusion}\neq\text{planning}
$$

$$
\text{denoising trajectory}\neq\text{physical trajectory}
$$

$$
\text{data score}\neq\text{Bellman value gradient}
$$

这三点决定了 diffusion 无法从原理上无缝融入另一条 model based 路线。

---

## 14. 结论

diffusion 的优势来自它对复杂数据分布的强大拟合能力。它可以表示多模态、高维、非显式的经验分布，这是它的强项。

但正因为如此，它的本质也是受限的：它依赖数据分布，而不是环境模型；它学习 score，而不是 value；它执行 denoising，而不是 Bellman backup；它生成样本，而不是进行 model based planning。

如果 model based 信息只在终点样本处可得，那么它只能用于定义、筛选或评价最终数据。它不能自然地进入 diffusion 的中间采样过程。

除非每一个噪声层级都已经拥有与真实规划问题一致的 Bellman 最优结构，否则中间 guidance 就没有第一性原理支持。而如果这种结构真的可得，那么我们事实上已经拥有了规划器本身，也就不需要 diffusion 来承担这个角色。

因此，可以给出最终判断：

> diffusion 是纯粹的，仅限于 data based 的方法。它可以学习被 model based 方法塑造过的数据，但不能在自身训练或推理机制中真正吸收 model based 原理。凡是试图在 diffusion 中间层级注入最终环境反馈的做法，本质上都是在把 denoising path 误认为 planning path，从而破坏了 diffusion 最强大的部分：对数据分布本身的拟合能力。
